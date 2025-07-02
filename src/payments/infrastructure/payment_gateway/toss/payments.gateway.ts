import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentsGateway } from 'src/payments/application/ports/payments.gateway';

@Injectable()
export class TossPaymentsGateway implements PaymentsGateway {
  private readonly logger = new Logger(TossPaymentsGateway.name);
  private readonly tossUrl: string | undefined;
  private readonly tossSecretKey: string | undefined;

  constructor(private readonly configService: ConfigService) {
    this.tossUrl = this.configService.get<string>('TOSS_PAYMENTS_URL') || '';
    this.tossSecretKey = this.configService.get<string>('TOSS_SECRET_KEY');
  }

  async confirmPayment(
    paymentKey: string,
    orderId: number,
    amount: number,
  ): Promise<boolean> {
    const encodedSecret = Buffer.from(`${this.tossSecretKey}:`).toString(
      'base64',
    );

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

    if (!response.ok) {
      this.logger.error(`Payment confirmation failed: ${response.statusText}`);
      this.logger.error(`Payment confirmation failed: ${response.status}`);

      return false;
    }

    this.logger.log(`Payment confirmation success`);
    this.logger.log(`paymentKey: ${paymentKey}`);
    this.logger.log(`orderId: ${orderId}`);
    this.logger.log(`amount: ${amount}`);

    return true;
  }
}
