import { IsNotEmpty, IsString } from 'class-validator';

export class CancelPaymentReqDto {
  @IsNotEmpty()
  @IsString()
  paymentKey: string;
}
