import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ConfirmPaymentDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  paymentsKey: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
