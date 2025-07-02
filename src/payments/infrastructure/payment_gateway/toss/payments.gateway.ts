import { ConfigService } from '@nestjs/config';
import { PaymentsGateway } from 'src/payments/application/ports/payments.gateway';

export class TossPaymentsGateway implements PaymentsGateway {
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
  ): Promise<Response> {
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

    return response;
  }
}
