import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { OrderStatus } from '../../../../orders/domain/value-object/order-status.enum';

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'The status of the order',
    example: OrderStatus.PENDING,
  })
  status: OrderStatus;
}
