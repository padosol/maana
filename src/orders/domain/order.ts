import { BadRequestException } from '@nestjs/common';
import { OrderItem } from './order-item';
import { OrderStatus } from './value-object/order-status.enum';

export class Order {
  constructor(
    public readonly id: bigint,
    public readonly userId: bigint,
    public readonly orderItems: OrderItem[],
    public readonly totalAmount: number,
    public status: OrderStatus,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  completePayment() {
    this.status = OrderStatus.PAID;
  }

  updateStatus(status: OrderStatus) {
    if (this.status === OrderStatus.PAID) {
      throw new BadRequestException('Order is already paid');
    }

    this.status = status;
  }
}
