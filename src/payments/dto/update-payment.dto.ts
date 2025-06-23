import { PartialType } from '@nestjs/swagger';
import { CreatePaymentDto } from './request/create-payment.req.dto';

export class UpdatePaymentDto extends PartialType(CreatePaymentDto) {}
