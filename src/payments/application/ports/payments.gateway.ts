export abstract class PaymentsGateway {
  abstract confirmPayment(
    paymentKey: string,
    orderId: number,
    amount: number,
  ): Promise<boolean>;
}
