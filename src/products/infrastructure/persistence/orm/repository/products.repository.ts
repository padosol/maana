import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsRepository } from 'src/products/application/ports/products.repository';
import { Product } from 'src/products/domain/products';
import { ProductsMapper } from '../mappers/products.mapper';

@Injectable()
export class OrmProductsPersistence implements ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.products.findMany({
      include: { category: true },
    });

    return products.map((product) => ProductsMapper.toDomain(product));
  }

  async findById(id: number): Promise<Product | null> {
    const product = await this.prisma.products.findUnique({
      where: { id },
      include: { category: true },
    });

    return product ? ProductsMapper.toDomain(product) : null;
  }

  async create(product: Product): Promise<Product> {
    const { name, price, description, stock, categoryId } =
      ProductsMapper.toPersistence(product);

    const createdProduct = await this.prisma.products.create({
      data: { name, price, description, stock, categoryId },
      include: { category: true },
    });

    return ProductsMapper.toDomain(createdProduct);
  }

  async update(id: number, product: Product): Promise<Product> {
    const productData = ProductsMapper.toPersistence(product);

    const updatedProduct = await this.prisma.products.update({
      where: { id },
      data: productData,
      include: { category: true },
    });

    return ProductsMapper.toDomain(updatedProduct);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.products.delete({
      where: { id },
    });
  }
}
