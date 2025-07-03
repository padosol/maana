import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepository } from 'src/orders/application/ports/order.repository';
import { Order } from 'src/orders/domain/order';
import { OrderStatus } from 'src/orders/domain/value-object/order-status.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsRepository } from 'src/products/application/ports/products.repository';
import { ConfirmPaymentDto } from '../presenters/http/dto/request/confirm.payment.dto';
import { PaymentsGateway } from './ports/payments.gateway';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly paymentsGateway: PaymentsGateway,
    private readonly ordersRepository: OrderRepository,
    private readonly productsRepository: ProductsRepository,
  ) {}

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto): Promise<boolean> {
    const { paymentKey, orderId, amount } = confirmPaymentDto;

    const order = await this.ordersRepository.findOne(orderId);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is not pending');
    }

    if (order.totalAmount !== amount) {
      throw new BadRequestException('Amount is not correct');
    }

    const response = await this.paymentsGateway.confirmPayment(
      paymentKey,
      orderId,
      amount,
    );

    if (!response) {
      throw new BadRequestException('Payment confirmation failed');
    }

    await this.successPayment(order);

    return true;
  }

  async successPayment(order: Order) {
    await this.prisma.$transaction(async (tx) => {
      // 재고 감소
      for (const item of order.orderItems) {
        const product = await this.productsRepository.findById(
          item.productId,
          tx,
        );

        if (!product) {
          throw new NotFoundException('Product not found');
        }

        product.decreaseStock(item.stock);

        await this.productsRepository.update(product.id!, product, tx);
      }

      order.completePayment();
      await this.ordersRepository.update(order.id, order, tx);
    });
  }
}
