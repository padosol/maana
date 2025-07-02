import { Product } from 'src/products/domain/products';

export abstract class ProductsRepository {
  abstract create(product: Product): Promise<Product>;
  abstract findAll(): Promise<Product[]>;
  abstract findById(id: number): Promise<Product | null>;
  abstract update(id: number, product: Product): Promise<Product>;
  abstract delete(id: number): Promise<void>;
}
