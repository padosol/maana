import { Module } from '@nestjs/common';
import { PaymentsGateway } from 'src/payments/application/ports/payments.gateway';
import { LocalPaymentsGateway } from './payments.gateway';

@Module({
  providers: [
    {
      provide: PaymentsGateway,
      useClass: LocalPaymentsGateway,
    },
  ],
  exports: [PaymentsGateway],
})
export class LocalPaymentsGatewayModule {}
