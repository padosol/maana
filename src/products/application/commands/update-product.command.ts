export class UpdateProductCommand {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly price: number,
    public readonly description: string,
    public readonly quantity: number,
    public readonly categoryId: number,
  ) {}
}
