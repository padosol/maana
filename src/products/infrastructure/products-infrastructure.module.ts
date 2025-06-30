import { Module } from '@nestjs/common';
import { OrmProductsPersistence } from './persistence/orm/products.persistence';

@Module({
  imports: [OrmProductsPersistence],
})
export class ProductsInfrastructureModule {}
