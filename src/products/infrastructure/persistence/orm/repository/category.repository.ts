import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CategoryRepository } from 'src/products/application/ports/category.repository';
import { Category } from 'src/products/domain/category';
import { CategoryMapper } from '../mappers/category.mapper';

@Injectable()
export class OrmCategoryPersistence implements CategoryRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(category: Category): Promise<Category> {
    const categoryData = CategoryMapper.toPersistence(category);

    const createdCategory = await this.prisma.category.create({
      data: categoryData,
    });

    return CategoryMapper.toDomain(createdCategory);
  }

  async findAll(): Promise<Category[]> {
    const categories = await this.prisma.category.findMany();

    return categories.map((category) => CategoryMapper.toDomain(category));
  }

  async findById(id: bigint): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    return category ? CategoryMapper.toDomain(category) : null;
  }

  async update(id: bigint, category: Category): Promise<Category> {
    const categoryData = CategoryMapper.toPersistence(category);

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: categoryData,
    });

    return CategoryMapper.toDomain(updatedCategory);
  }

  async delete(id: bigint): Promise<void> {
    await this.prisma.category.delete({
      where: { id },
    });
  }
}
