import { Module } from '@nestjs/common';
import { ProductsRepository } from 'src/products/application/ports/products.repository';
import { OrmProductsPersistence } from './repository/products.repository';

@Module({
  imports: [],
  providers: [
    {
      provide: ProductsRepository,
      useClass: OrmProductsPersistence,
    },
  ],
  exports: [ProductsRepository],
})
export class OrmProductsPersistenceModule {}
,