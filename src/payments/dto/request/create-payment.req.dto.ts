import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentReqDto {
  @IsNotEmpty()
  @IsString()
  orderId: number;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
