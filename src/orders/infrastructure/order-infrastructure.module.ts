import { Module } from '@nestjs/common';
import { OrmOrderRepositoryModule } from './persistence/orm/orm-order-repository.module';

@Module({
  imports: [OrmOrderRepositoryModule],
  exports: [OrmOrderRepositoryModule],
})
export class OrderInfrastructureModule {}
