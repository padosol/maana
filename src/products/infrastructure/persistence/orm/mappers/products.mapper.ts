import { Prisma, Products as PrismaProducts } from '@prisma/client';
import { Product } from 'src/products/domain/products';
import { CategoryMapper } from './category.mapper';

type ProductWithCategory = Prisma.ProductsGetPayload<{
  include: { category: true };
}>;

export class ProductsMapper {
  static toDomain(product: ProductWithCategory): Product {
    return new Product(
      product.id,
      product.name,
      product.price,
      product.description ?? '',
      product.stock,
      CategoryMapper.toDomain(product.category),
      product.imageUrl ?? null,
      product.isActive,
    );
  }

  static toPersistence(product: Product): PrismaProducts {
    return {
      id: product.id!,
      name: product.name,
      price: product.price,
      description: product.description,
      stock: product.stock,
      imageUrl: product.imageUrl ?? '',
      isActive: true,
      categoryId: product.category.id!,
    };
  }
}
