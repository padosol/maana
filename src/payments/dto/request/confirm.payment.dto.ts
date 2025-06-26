import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '주문 ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  orderId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: '결제 키',
    example: 'paymentKey',
  })
  paymentKey: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: '결제 금액',
    example: 10000,
  })
  amount: number;
}
