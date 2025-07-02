import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../../products/application/products.service';
import { UsersService } from '../../users/application/users.service';
import { SnowflakeIdGenerator } from '../domain/generator/order-id-generator';
import { Order } from '../domain/order';
import { OrderItem } from '../domain/order-item';
import { OrderStatus } from '../domain/value-object/order-status.enum';
import { UpdateOrderStatusDto } from '../presenters/http/dto/update-order-status.dto';
import { CreateOrderCommand } from './commands/create-order.command';
import { OrderRepository } from './ports/order.repository';

@Injectable()
export class OrdersService {
  constructor(
    private orderRepository: OrderRepository,
    private userService: UsersService,
    private productService: ProductsService,
  ) {}

  private readonly logger = new Logger(OrdersService.name);

  async create(createOrderDto: CreateOrderCommand): Promise<Order> {
    const { userId, items } = createOrderDto;

    await this.userService.findOneById(userId);

    const orderItems: OrderItem[] = [];
    let total = 0;

    // 주문번호 생성
    const orderId = new SnowflakeIdGenerator(0, 0).nextId();

    for (const item of items) {
      const product = await this.productService.findProductById(item.productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const orderItem = new OrderItem(
        null,
        orderId,
        product.id!,
        item.quantity,
        product.price.toNumber(),
        product.price.toNumber() * item.quantity,
      );
      orderItems.push(orderItem);
      total += orderItem.totalPrice;
    }

    const order = new Order(
      orderId,
      userId,
      orderItems,
      total,
      OrderStatus.PENDING,
      new Date(),
      new Date(),
    );

    return this.orderRepository.create(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepository.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrderStatus(
    id: number,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.updateStatus(updateOrderStatusDto.status);

    return this.orderRepository.update(id, order);
  }

  async remove(id: number): Promise<void> {
    this.logger.log(`Removing order with id: ${id}`);

    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.orderRepository.remove(id);
  }
}
