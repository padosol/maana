import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductsRepository } from 'src/products/application/ports/products.repository';
import { Product } from 'src/products/domain/products';
import { ProductsMapper } from '../mappers/products.mapper';

@Injectable()
export class OrmProductsPersistence implements ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<Product[]> {
    const products = await tx.products.findMany({
      include: { category: true },
    });

    return products.map((product) => ProductsMapper.toDomain(product));
  }

  async findById(
    id: number,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<Product | null> {
    const product = await tx.products.findUnique({
      where: { id },
      include: { category: true },
    });

    return product ? ProductsMapper.toDomain(product) : null;
  }

  async create(
    product: Product,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<Product> {
    const { id, ...rest } = ProductsMapper.toPersistence(product);

    const createdProduct = await tx.products.create({
      data: rest,
      include: { category: true },
    });

    return ProductsMapper.toDomain(createdProduct);
  }

  async update(
    id: number,
    product: Product,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<Product> {
    const productData = ProductsMapper.toPersistence(product);

    const updatedProduct = await tx.products.update({
      where: { id },
      data: productData,
      include: { category: true },
    });

    return ProductsMapper.toDomain(updatedProduct);
  }

  async delete(
    id: number,
    tx: Prisma.TransactionClient = this.prisma,
  ): Promise<void> {
    await tx.products.delete({
      where: { id },
    });
  }
}
