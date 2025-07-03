import { Prisma } from '@prisma/client';
import { Product } from 'src/products/domain/products';

export abstract class ProductsRepository {
  abstract create(
    product: Product,
    tx?: Prisma.TransactionClient,
  ): Promise<Product>;
  abstract findAll(tx?: Prisma.TransactionClient): Promise<Product[]>;
  abstract findById(
    id: number,
    tx?: Prisma.TransactionClient,
  ): Promise<Product | null>;
  abstract update(
    id: number,
    product: Product,
    tx?: Prisma.TransactionClient,
  ): Promise<Product>;
  abstract delete(id: number, tx?: Prisma.TransactionClient): Promise<void>;
}
