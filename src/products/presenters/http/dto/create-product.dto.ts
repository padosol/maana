import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The name of the product',
    example: 'Product 1',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The description of the product',
    example: 'Product 1 description',
  })
  description?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The price of the product',
    example: 100,
  })
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The quantity of the product',
    example: 10,
  })
  stock: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The category ID of the product',
    example: 1,
  })
  categoryId: bigint;
}
