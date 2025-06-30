import { Injectable, NotFoundException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { Category } from '../domain/category';
import { ProductsFactory } from '../domain/factories/products.factory';
import { Product } from '../domain/products';
import { CreateCategoryDto } from '../presenters/http/dto/create-category.dto';
import { UpdateCategoryDto } from '../presenters/http/dto/update-category.dto';
import { UpdateProductDto } from '../presenters/http/dto/update-product.dto';
import { CreateProductCommand } from './commands/create-product.command';
import { CategoryRepository } from './ports/category.repository';
import { ProductsRepository } from './ports/products.repository';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly productsFactory: ProductsFactory,
  ) {}

  async createProduct(
    createProductDto: CreateProductCommand,
  ): Promise<Product> {
    const { categoryId } = createProductDto;

    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = this.productsFactory.create(createProductDto);
    product.category = category;

    return this.productRepository.create(product);
  }

  async findAllProducts(): Promise<Product[]> {
    return this.productRepository.findAll();
  }

  async findProductById(id: bigint): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async updateProduct(
    id: bigint,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const { categoryId } = updateProductDto;

    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    product.category = category;
    product.name = updateProductDto.name ?? product.name;
    product.description = updateProductDto.description ?? product.description;
    product.price = new Decimal(updateProductDto.price);
    product.stock = updateProductDto.stock ?? product.stock;

    return this.productRepository.update(id, product);
  }

  async deleteProduct(id: bigint): Promise<void> {
    await this.productRepository.delete(id);
  }

  async createCategory(
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    const category = new Category(null, createCategoryDto.name, '', null);

    return this.categoryRepository.create(category);
  }

  async findAllCategories(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findCategoryById(id: bigint): Promise<Category> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async updateCategory(
    id: bigint,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findCategoryById(id);

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    category.name = updateCategoryDto.name;
    category.description = updateCategoryDto.description;

    return this.categoryRepository.update(id, category);
  }

  async deleteCategory(id: bigint): Promise<void> {
    await this.categoryRepository.delete(id);
  }
}
