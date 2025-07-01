import { Product } from 'src/products/domain/products';

export abstract class ProductsRepository {
  abstract create(product: Product): Promise<Product>;
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: bigint): Promise<Product | null>;
  abstract update(id: bigint, product: Product): Promise<Product>;
  abstract delete(id: bigint): Promise<void>;
}
