export class OrderItem {
  constructor(
    public readonly id: bigint | null,
    public readonly orderId: bigint,
    public readonly productId: bigint,
    public readonly stock: number,
    public readonly unitPrice: number,
    public readonly totalPrice: number,
  ) {}
}
