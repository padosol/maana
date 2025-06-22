import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product 1',
  })
  name?: string;

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
  price?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The SKU of the product',
    example: '1234567890',
  })
  sku?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The quantity of the product',
    example: 10,
  })
  quantity?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    description: 'The category ID of the product',
    example: 1,
  })
  categoryId?: number;
}
