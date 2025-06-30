import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../../products/application/products.service';
import { UsersService } from '../../users/application/users.service';
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

    const user = await this.userService.findOneById(userId);

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of items) {
      const product = await this.productService.findOneById(item.productId);
      if (!product) {
        throw new NotFoundException('Product not found');
      }

      const orderItem = this.orderItemRepository.create({
        productId: product.id,
        unitPrice: product.price,
        quantity: item.quantity,
        totalPrice: product.price * item.quantity,
      });
      orderItems.push(orderItem);
      total += orderItem.totalPrice;
    }

    const order = this.orderRepository.create({
      user,
      status: OrderStatus.PENDING,
      orderItems: orderItems,
      totalAmount: total,
    });

    return this.orderRepository.save(order);
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['user', 'orderItems'],
    });
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async updateOrderStatus(
    id: string,
    updateOrderStatusDto: UpdateOrderStatusDto,
  ): Promise<Order> {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    order.status = updateOrderStatusDto.status;
    return this.orderRepository.save(order);
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Removing order with id: ${id}`);

    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    await this.orderRepository.remove(order);
  }
}
