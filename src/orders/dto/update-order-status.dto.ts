import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The status of the order',
    example: 'pending',
  })
  status: string;
}
