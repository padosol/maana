import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from './entity/category.entity';
import { Product } from './entity/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: Repository<Product>,
    private readonly categoryRepository: Repository<Category>,
  ) {}
}
