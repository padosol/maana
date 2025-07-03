import { Injectable } from '@nestjs/common';
import { PaymentsGateway } from 'src/payments/application/ports/payments.gateway';

@Injectable()
export class LocalPaymentsGateway implements PaymentsGateway {
  async confirmPayment(
    paymentKey: string,
    orderId: number,
    amount: number,
  ): Promise<any> {
    console.log(paymentKey, orderId, amount);

    return true;
  }
}
