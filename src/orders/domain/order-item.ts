export class OrderItem {
  constructor(
    public readonly id: number | null,
    public readonly orderId: number,
    public readonly productId: number,
    public readonly stock: number,
    public readonly unitPrice: number,
    public readonly totalPrice: number,
  ) {}
}
