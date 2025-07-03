import { Module } from '@nestjs/common';
import { ProductsFactory } from '../domain/factories/products.factory';
import { ProductsInfrastructureModule } from '../infrastructure/products-infrastructure.module';
import { ProductsController } from '../presenters/http/products.controller';
import { ProductsService } from './products.service';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ProductsFactory],
  imports: [ProductsInfrastructureModule],
  exports: [ProductsService, ProductsInfrastructureModule],
})
export class ProductsModule {}
