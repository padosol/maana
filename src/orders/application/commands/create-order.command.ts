import { CreateOrderItemCommand } from './create-order-item.command';

export class CreateOrderCommand {
  constructor(
    public readonly userId: bigint,
    public readonly items: CreateOrderItemCommand[],
  ) {}
}
