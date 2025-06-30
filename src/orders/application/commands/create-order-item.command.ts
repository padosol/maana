export class CreateOrderItemCommand {
  constructor(
    public readonly productId: bigint,
    public readonly quantity: number,
  ) {}
}
