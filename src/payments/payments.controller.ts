import { Body, Controller, Post } from '@nestjs/common';
import { ConfirmPaymentDto } from './dto/confirm.payment.dto';
import { PaymentsService } from './payments.service';

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
