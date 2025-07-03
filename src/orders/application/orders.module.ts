import { Module } from '@nestjs/common';
import { ProductsModule } from 'src/products/application/products.module';
import { UsersModule } from 'src/users/application/users.module';
import { OrderInfrastructureModule } from '../infrastructure/order-infrastructure.module';
import { OrdersController } from '../presenters/http/orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [OrderInfrastructureModule, UsersModule, ProductsModule],
  exports: [OrdersService, OrderInfrastructureModule],
})
export class OrdersModule {}
