import { Injectable } from '@nestjs/common';
import { OrderRepository } from 'src/orders/application/ports/order.repository';
import { Order } from 'src/orders/domain/order';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class OrmOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(order: Order): Promise<Order> {
    const orderOrm = OrderMapper.toPersistence(order);
    const createdOrder = await this.prisma.orders.create({
      data: {
        ...orderOrm,
        orderItems: {
          create: orderOrm.orderItems,
        },
      },
      include: {
        orderItems: true,
      },
    });
    return OrderMapper.toDomain(createdOrder);
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.orders.findMany({
      include: {
        orderItems: true,
      },
    });
    return orders.map((order) => OrderMapper.toDomain(order));
  }

  async findOne(id: bigint): Promise<Order | null> {
    const order = await this.prisma.orders.findUnique({
      where: { id },
      include: {
        orderItems: true,
      },
    });
    return order ? OrderMapper.toDomain(order) : null;
  }

  async update(id: bigint, order: Order): Promise<Order> {
    const orderOrm = OrderMapper.toPersistence(order);
    const updatedOrder = await this.prisma.orders.update({
      where: { id },
      data: {
        ...orderOrm,
        orderItems: {
          create: orderOrm.orderItems,
        },
      },
      include: {
        orderItems: true,
      },
    });
    return OrderMapper.toDomain(updatedOrder);
  }

  async remove(id: bigint): Promise<void> {
    await this.prisma.orders.delete({ where: { id } });
  }
}
