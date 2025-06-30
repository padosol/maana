import { Order } from 'src/orders/domain/order';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<Order>;
  abstract findAll(): Promise<Order[]>;
  abstract findOne(id: bigint): Promise<Order | null>;
  abstract update(id: bigint, order: Order): Promise<Order>;
  abstract remove(id: bigint): Promise<void>;
}
