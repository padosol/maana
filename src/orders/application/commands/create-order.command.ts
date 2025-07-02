import { CreateOrderItemCommand } from './create-order-item.command';

export class CreateOrderCommand {
  constructor(
    public readonly userId: number,
    public readonly items: CreateOrderItemCommand[],
  ) {}
}
