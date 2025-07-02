export class CreateOrderItemCommand {
  constructor(
    public readonly productId: number,
    public readonly quantity: number,
  ) {}
}
