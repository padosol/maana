import { OrderItem as PrismaOrderItem } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { OrderItem } from 'src/orders/domain/order-item';

export class OrderItemMapper {
  static toDomain(orderItem: PrismaOrderItem): OrderItem {
    return new OrderItem(
      orderItem.id,
      orderItem.orderId,
      orderItem.productId,
      orderItem.quantity,
      orderItem.unitPrice.toNumber(),
      orderItem.totalPrice.toNumber(),
    );
  }

  static toPersistence(orderItem: OrderItem): PrismaOrderItem {
    return {
      id: orderItem.id,
      orderId: orderItem.orderId,
      productId: orderItem.productId,
      quantity: orderItem.quantity,
      unitPrice: new Decimal(orderItem.unitPrice),
      totalPrice: new Decimal(orderItem.totalPrice),
    };
  }
}
