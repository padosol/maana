import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { Order } from 'src/orders/domain/order';
import { OrderStatus } from 'src/orders/domain/value-object/order-status.enum';
import { OrderItemMapper } from './order-item.mapper';

type OrderWithOrderItems = Prisma.OrdersGetPayload<{
  include: { orderItems: true };
}>;

export class OrderMapper {
  static toDomain(order: OrderWithOrderItems): Order {
    return new Order(
      order.id,
      order.userId,
      order.orderItems.map((item) => OrderItemMapper.toDomain(item)),
      order.total.toNumber(),
      order.status as OrderStatus,
      order.createdAt,
      order.updatedAt ?? new Date(),
    );
  }

  static toPersistence(order: Order): OrderWithOrderItems {
    return {
      id: order.id,
      userId: order.userId,
      orderItems: order.items.map((item) =>
        OrderItemMapper.toPersistence(item),
      ),
      total: new Decimal(order.total),
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt ?? new Date(),
    };
  }
}
