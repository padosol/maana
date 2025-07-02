import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from 'src/orders/application/orders.service';
import { Order } from 'src/orders/domain/order';
import { OrderStatus } from 'src/orders/domain/value-object/order-status.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/application/products.service';
import { UpdateProductDto } from 'src/products/presenters/http/dto/update-product.dto';
import { ConfirmPaymentDto } from '../presenters/http/dto/request/confirm.payment.dto';
import { PaymentsGateway } from './ports/payments.gateway';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly paymentsGateway: PaymentsGateway,
  ) {}

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto): Promise<boolean> {
    const { paymentKey, orderId, amount } = confirmPaymentDto;

    const order = await this.ordersService.findOne(orderId);
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
        const product = await this.productsService.findProductById(
          item.productId,
        );

        product.decreaseStock(item.stock);
        const updateProductDto: UpdateProductDto = {
          categoryId: product.category.id!,
          stock: product.stock,
          price: product.price.toNumber(),
          description: product.description,
          name: product.name,
        };
        await this.productsService.updateProduct(product.id!, updateProductDto);
      }

      order.completePayment();
      await tx.orders.update({
        where: { id: order.id },
        data: { status: OrderStatus.COMPLETED.toString() }, // TODO: 추후 수정
      });
    });
  }
}
