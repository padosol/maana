import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { OrdersService } from 'src/orders/application/orders.service';
import { Order } from 'src/orders/domain/order';
import { OrderStatus } from 'src/orders/domain/value-object/order-status.enum';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsService } from 'src/products/application/products.service';
import { UpdateProductDto } from 'src/products/presenters/http/dto/update-product.dto';
import { ConfirmPaymentDto } from './presenters/http/dto/request/confirm.payment.dto';
import { TossPaymentResponseDto } from './type/toss.payment';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name, {
    timestamp: true,
  });
  private readonly tossUrl: string | undefined;
  private readonly tossSecretKey: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {
    this.tossSecretKey = this.configService.get<string>('TOSS_SECRET_KEY');
    if (!this.tossSecretKey) {
      throw new Error('TOSS_SECRET_KEY is not set');
    }

    this.tossUrl = this.configService.get<string>('TOSS_PAYMENTS_URL') || '';

    if (!this.tossUrl) {
      throw new Error('TOSS_URL is not set');
    }

    this.logger.log(this.tossSecretKey);
    this.logger.log(this.tossUrl);
  }

  async confirmPayment(confirmPaymentDto: ConfirmPaymentDto): Promise<boolean> {
    this.logger.log('confirmPayment Start');
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

    const encodedSecret = Buffer.from(`${this.tossSecretKey}:`).toString(
      'base64',
    );

    this.logger.log(`encodedSecret: ${encodedSecret}`);

    const response = await fetch(`${this.tossUrl}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${encodedSecret}`,
      },
      body: JSON.stringify({
        paymentKey: paymentKey,
        orderId: orderId,
        amount: amount,
      }),
    });

    const json = JSON.stringify(await response.json());

    if (!response.ok) {
      this.logger.error(`Payment confirmation failed: ${json}`);
      throw new BadRequestException('Payment confirmation failed');
    }

    const data = plainToInstance(TossPaymentResponseDto, JSON.parse(json));

    this.logger.log(`data: ${JSON.stringify(data)}`);

    await this.successPayment(order, data);

    return true;
  }

  async successPayment(order: Order, data: TossPaymentResponseDto) {
    this.logger.log('successPayment Start');

    await this.prisma.$transaction(async (tx) => {
      this.logger.log(`결제 승인 성공: ${JSON.stringify(data)}`);

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
      await this.ordersService.updateOrderStatus(order.id, order);
    });
  }
}
