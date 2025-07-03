import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { OrderRepository } from 'src/orders/application/ports/order.repository';
import { Order } from 'src/orders/domain/order';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderMapper } from '../mappers/order.mapper';

@Injectable()
export class OrmOrderRepository implements OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    order: Order,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<Order> {
    const orderOrm = OrderMapper.toPersistence(order);
    const createdOrder = await tx.orders.create({
      data: {
        ...orderOrm,
        orderItems: {
          create: orderOrm.orderItems.map((item) => {
            const { id, orderId, ...rest } = item;

            return {
              ...rest,
            };
          }),
        },
      },
      include: {
        orderItems: true,
      },
    });
    return OrderMapper.toDomain(createdOrder);
  }

  async findAll(tx: Prisma.TransactionClient = this.prisma): Promise<Order[]> {
    const orders = await tx.orders.findMany({
      include: {
        orderItems: true,
      },
    });
    return orders.map((order) => OrderMapper.toDomain(order));
  }

  async findOne(
    id: number,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<Order | null> {
    const order = await tx.orders.findUnique({
      where: { id: Number(id) },
      include: {
        orderItems: true,
      },
    });
    return order ? OrderMapper.toDomain(order) : null;
  }

  async update(
    id: number,
    order: Order,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<Order> {
    const orderOrm = OrderMapper.toPersistence(order);
    const updatedOrder = await tx.orders.update({
      where: { id },
      data: {
        ...orderOrm,
        orderItems: {
          create: orderOrm.orderItems.map((item) => {
            const { id, orderId, ...rest } = item;

            return {
              ...rest,
            };
          }),
        },
      },
      include: {
        orderItems: true,
      },
    });
    return OrderMapper.toDomain(updatedOrder);
  }

  async remove(
    id: number,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    await tx.orders.delete({ where: { id } });
  }
}
