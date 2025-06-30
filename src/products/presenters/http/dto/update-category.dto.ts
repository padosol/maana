import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The name of the category',
    example: 'Category 1',
  })
  name: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'The description of the category',
    example: 'Category 1 description',
  })
  description: string;
}
