import { Body, Controller, Post } from '@nestjs/common';
import { PaymentsService } from '../../application/payments.service';
import { ConfirmPaymentDto } from './dto/request/confirm.payment.dto';

@Controller({
  path: 'payments',
  version: '1',
})
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('confirm')
  confirmPayment(
    @Body() confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<boolean> {
    return this.paymentsService.confirmPayment(confirmPaymentDto);
  }
}
