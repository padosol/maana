import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CategoryRepository } from 'src/products/application/ports/category.repository';
import { ProductsRepository } from 'src/products/application/ports/products.repository';
import { OrmCategoryPersistence } from './repository/category.repository';
import { OrmProductsPersistence } from './repository/products.repository';

@Module({
  imports: [PrismaModule],
  providers: [
    {
      provide: ProductsRepository,
      useClass: OrmProductsPersistence,
    },
    {
      provide: CategoryRepository,
      useClass: OrmCategoryPersistence,
    },
  ],
  exports: [ProductsRepository, CategoryRepository],
})
export class OrmProductsPersistenceModule {}
