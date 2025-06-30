import { Decimal } from '@prisma/client/runtime/library';
import { CreateProductCommand } from 'src/products/application/commands/create-product.command';
import { Category } from '../category';
import { Product } from '../products';

export class ProductsFactory {
  create(product: CreateProductCommand): Product {
    return new Product(
      null,
      product.name,
      new Decimal(product.price),
      product.description,
      product.stock,
      new Category(product.categoryId, '', '', null),
      null,
      true,
    );
  }
}
