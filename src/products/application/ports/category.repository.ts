import { Category } from 'src/products/domain/category';

export abstract class CategoryRepository {
  abstract create(category: Category): Promise<Category>;
  abstract findAll(): Promise<Category[]>;
  abstract findById(id: number): Promise<Category | null>;
  abstract update(id: number, category: Category): Promise<Category>;
  abstract delete(id: number): Promise<void>;
}
