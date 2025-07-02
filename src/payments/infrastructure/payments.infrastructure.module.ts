import { Module } from '@nestjs/common';
import { ApplicationBootstrapOptions } from 'src/common/interfaces/application-bootstrap-options.interface';
import { LocalPaymentsGatewayModule } from './payment_gateway/local/local-payments.gateway.module';
import { TossPaymentsGatewayModule } from './payment_gateway/toss/toss-payments.gateway.module';

@Module({})
export class PaymentsInfrastructureModule {
  static use(applicationBootstrapOptions: ApplicationBootstrapOptions) {
    const pgModule =
      applicationBootstrapOptions.pg === 'toss'
        ? TossPaymentsGatewayModule
        : LocalPaymentsGatewayModule;

    return {
      module: PaymentsInfrastructureModule,
      imports: [pgModule],
      exports: [pgModule],
    };
  }
}
