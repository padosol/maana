import { Module } from '@nestjs/common';
import { OrderRepository } from 'src/orders/application/ports/order.repository';
import { OrmOrderRepository } from './repository/order.repository';

@Module({
  providers: [
    {
      provide: OrderRepository,
      useClass: OrmOrderRepository,
    },
  ],
  exports: [OrderRepository],
})
export class OrmOrderRepositoryModule {}
