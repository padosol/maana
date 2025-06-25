import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmPaymentDto } from './dto/confirm.payment.dto';
import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from './entities/payment.entity';
import { TossPaymentResponseDto } from './type/toss.payment';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  private readonly tossUrl: string | undefined;
  private readonly tossSecretKey: string | undefined;

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
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
    const { paymentsKey, orderId, amount } = confirmPaymentDto;

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
        paymentKey: paymentsKey,
        orderId: orderId,
        amount: amount,
      }),
    })
      .then(async (res) => {
        const data: TossPaymentResponseDto =
          (await res.json()) as TossPaymentResponseDto;

        this.logger.log(`결제 승인 성공: ${JSON.stringify(data)}`);

        const payment = this.paymentRepository.create({
          orderId: Number(data.orderId),
          paymentMethod: PaymentMethod.CARD,
          amount: data.totalAmount,
          status: PaymentStatus.COMPLETED,
          paymentKey: data.paymentKey,
        });

        await this.paymentRepository.save(payment);

        return true;
      })
      .catch(async (err) => {
        this.logger.error(err);

        const payment = this.paymentRepository.create({
          orderId: orderId,
          paymentMethod: PaymentMethod.CARD,
          amount: amount,
          status: PaymentStatus.FAILED,
          paymentKey: paymentsKey,
        });

        await this.paymentRepository.save(payment);

        return false;
      });
  }
}
