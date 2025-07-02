import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product 1',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The description of the product',
    example: 'Product 1 description',
  })
  description?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The price of the product',
    example: 100,
  })
  price: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The stock of the product',
    example: 10,
  })
  stock: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The category ID of the product',
    example: 1,
  })
  categoryId: number;
}
