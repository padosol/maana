import { Module } from '@nestjs/common';
import { OrderInfrastructureModule } from '../infrastructure/order-infrastructure.module';
import { OrdersController } from '../presenters/http/orders.controller';
import { OrdersService } from './orders.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [OrderInfrastructureModule],
  exports: [OrdersService],
})
export class OrdersModule {}
