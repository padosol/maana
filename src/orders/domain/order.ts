import { OrderItem } from './order-item';
import { OrderStatus } from './value-object/order-status.enum';

export class Order {
  constructor(
    public readonly id: bigint,
    public readonly userId: bigint,
    public readonly items: OrderItem[],
    public readonly total: number,
    public readonly status: OrderStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
