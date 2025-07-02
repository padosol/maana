import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductCommand } from 'src/products/application/commands/create-product.command';
import { ProductsService } from 'src/products/application/products.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  private readonly logger = new Logger(ProductsController.name);

  constructor(private readonly productsService: ProductsService) {}

  @Post('categories')
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.productsService.createCategory(createCategoryDto);
  }

  @Get('categories')
  findAllCategories() {
    return this.productsService.findAllCategories();
  }

  @Get('categories/:id')
  findCategoryById(@Param('id') id: number) {
    return this.productsService.findCategoryById(id);
  }

  @Put('categories/:id')
  updateCategory(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.productsService.updateCategory(id, updateCategoryDto);
  }

  @Delete('categories/:id')
  deleteCategory(@Param('id') id: number) {
    return this.productsService.deleteCategory(id);
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsService.createProduct(
      new CreateProductCommand(
        createProductDto.name,
        createProductDto.price,
        createProductDto.description || null,
        createProductDto.stock,
        createProductDto.categoryId,
      ),
    );
  }

  @Get()
  findAllProducts() {
    return this.productsService.findAllProducts();
  }

  @Get(':id')
  findProductById(@Param('id') id: number) {
    this.logger.log(`Finding product by id: ${id}`);
    return this.productsService.findProductById(id);
  }

  @Put(':id')
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Delete(':id')
  deleteProduct(@Param('id') id: number) {
    return this.productsService.deleteProduct(id);
  }
}
