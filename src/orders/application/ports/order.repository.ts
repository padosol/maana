import { Order } from 'src/orders/domain/order';

export abstract class OrderRepository {
  abstract create(order: Order): Promise<Order>;
  abstract findAll(): Promise<Order[]>;
  abstract findOne(id: number): Promise<Order | null>;
  abstract update(id: number, order: Order): Promise<Order>;
  abstract remove(id: number): Promise<void>;
}
