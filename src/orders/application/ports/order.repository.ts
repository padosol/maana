import { Prisma } from '@prisma/client';
import { Order } from 'src/orders/domain/order';

export abstract class OrderRepository {
  abstract create(order: Order, tx?: Prisma.TransactionClient): Promise<Order>;
  abstract findAll(tx?: Prisma.TransactionClient): Promise<Order[]>;
  abstract findOne(
    id: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Order | null>;
  abstract update(
    id: number,
    order: Order,
    tx?: Prisma.TransactionClient,
  ): Promise<Order>;
  abstract remove(id: number, tx?: Prisma.TransactionClient): Promise<void>;
}
