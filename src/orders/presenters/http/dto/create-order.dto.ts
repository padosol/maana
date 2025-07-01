import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber, ValidateNested } from 'class-validator';

class OrderItemDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The product ID',
    example: 1,
  })
  productId: bigint;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The quantity of the product',
    example: 1,
  })
  quantity: number;
}

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The user ID',
    example: 1,
  })
  userId: bigint;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  @ApiProperty({
    description: 'The items of the order',
    example: [{ productId: 1, quantity: 1 }],
  })
  items: OrderItemDto[];
}
