import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymentsGateway } from 'src/payments/application/ports/payments.gateway';
import { TossPaymentsGateway } from './payments.gateway';

@Module({
  providers: [
    {
      provide: PaymentsGateway,
      useClass: TossPaymentsGateway,
    },
  ],
  imports: [ConfigModule],
  exports: [PaymentsGateway],
})
export class TossPaymentsGatewayModule {}
