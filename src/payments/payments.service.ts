import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { OrderStatus } from 'src/orders/entities/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { ProductsService } from 'src/products/products.service';
import { ConfirmPaymentDto } from './dto/request/confirm.payment.dto';
import { TossPaymentResponseDto } from './type/toss.payment';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly tossUrl: string | undefined;
  private readonly tossSecretKey: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    private readonly ordersService: OrdersService,
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

    return await fetch(`${this.tossUrl}/confirm`, {
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
    })
      .then(async (res) => {
        const json: unknown = await res.json();
        const data: TossPaymentResponseDto = plainToInstance(
          TossPaymentResponseDto,
          json,
        );

        this.logger.log(`결제 승인 성공: ${JSON.stringify(data)}`);

        // 재고 감소
        for (const item of order.orderItems) {
          const product = await this.productsService.findProductById(
            item.productId,
          );
          if (!product) {
            throw new NotFoundException('Product not found');
          }

          product.decreaseStock(item.quantity);
          await this.productsService.updateProduct(product.id, product);
        }

        order.completePayment();
        await this.ordersService.updateOrderStatus(order.id, order);

        return true;
      })
      .catch(async (err) => {
        this.logger.error(`결제 승인 실패: ${err}`);

        return false;
      });
  }
}
