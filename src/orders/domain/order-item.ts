export class OrderItem {
  constructor(
    public readonly id: bigint,
    public readonly orderId: bigint,
    public readonly productId: bigint,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly totalPrice: number,
  ) {}
}
