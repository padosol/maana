import { Injectable, Logger } from '@nestjs/common';
import { PaymentsGateway } from 'src/payments/application/ports/payments.gateway';

@Injectable()
export class LocalPaymentsGateway implements PaymentsGateway {
  private readonly logger = new Logger(LocalPaymentsGateway.name);

  async confirmPayment(
    paymentKey: string,
    orderId: number,
    amount: number,
  ): Promise<any> {
    this.logger.log(
      `Confirming payment for paymentKey: ${paymentKey}, orderId: ${orderId}, amount: ${amount}`,
    );

    this.logger.log('Waiting for 1 second');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    this.logger.log('Payment confirmed');

    return true;
  }
}
