import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePaymentReqDto {
  @IsNotEmpty()
  @IsString()
  orderId: string;

  @IsNotEmpty()
  @IsString()
  paymentKey: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
