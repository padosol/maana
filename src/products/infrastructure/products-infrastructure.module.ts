import { Module } from '@nestjs/common';
import { OrmProductsPersistenceModule } from './persistence/orm/orm-products-persistence.module';

@Module({
  imports: [OrmProductsPersistenceModule],
  exports: [OrmProductsPersistenceModule],
})
export class ProductsInfrastructureModule {}
