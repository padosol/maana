import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentReqDto {
  @IsNotEmpty()
  @IsString()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  paymentKey: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
