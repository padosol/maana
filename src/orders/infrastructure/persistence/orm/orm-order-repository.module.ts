import { Module } from '@nestjs/common';
import { OrmOrderRepository } from './repository/order.repository';

@Module({
  providers: [OrmOrderRepository],
  exports: [OrmOrderRepository],
})
export class OrmOrderRepositoryModule {}
