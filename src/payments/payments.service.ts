import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfirmPaymentDto } from './dto/confirm.payment.dto';
import { CreatePaymentReqDto } from './dto/request/create-payment.req.dto';
import { PaymentResDto } from './dto/response/payment.res.dto';
import { Payment } from './entities/payment.entity';

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
        paymentKey: confirmPaymentDto.paymentsKey,
        orderId: confirmPaymentDto.orderId,
        amount: confirmPaymentDto.amount,
      }),
    })
      .then((res) => {
        this.logger.log(`결제 승인 성공: ${JSON.stringify(res)}`);
        return true;
      })
      .catch((err) => {
        this.logger.error(err);
        return false;
      });
  }

  async createPayment(
    createPaymentDto: CreatePaymentReqDto,
  ): Promise<PaymentResDto> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }
}
