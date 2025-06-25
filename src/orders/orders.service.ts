import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { UsersService } from '../users/users.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderItem } from './entities/order-item.entity';
import { Order, OrderStatus } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private userService: UsersService,
    private productService: ProductsService,
  ) {}

  private readonly logger = new Logger(OrdersService.name);

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, items } = createOrderDto;

    const user = await this.userService.findOneById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const orderItems: OrderItem[] = [];
    let total = 0;

    for (const item of items) {
      const product = await this.productService.findProductById(item.productId);
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
