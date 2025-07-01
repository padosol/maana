import { Category as PrismaCategory } from '@prisma/client';
import { Category } from 'src/products/domain/category';

export class CategoryMapper {
  static toDomain(category: PrismaCategory): Category {
    return new Category(
      category.id,
      category.name,
      category.description ?? '',
      category.parentId ?? null,
    );
  }

  static toPersistence(category: Category): PrismaCategory {
    return {
      id: category.id!,
      name: category.name,
      description: category.description,
      parentId: category.parentId,
    };
  }
}
