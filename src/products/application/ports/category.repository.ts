import { Category } from 'src/products/domain/category';

export abstract class CategoryRepository {
  abstract create(category: Category): Promise<Category>;
  abstract findAll(): Promise<Category[]>;
  abstract findById(id: bigint): Promise<Category | null>;
  abstract update(id: bigint, category: Category): Promise<Category>;
  abstract delete(id: bigint): Promise<void>;
}
