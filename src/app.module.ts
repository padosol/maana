import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/application/auth.module';
import { ApplicationBootstrapOptions } from './common/interfaces/application-bootstrap-options.interface';
import { OrdersModule } from './orders/application/orders.module';
import { PaymentsModule } from './payments/application/payments.module';
import { PaymentsInfrastructureModule } from './payments/infrastructure/payments.infrastructure.module';
import { ProductsModule } from './products/application/products.module';
import { UsersModule } from './users/application/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env',
    }),
    UsersModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {
  static register(options: ApplicationBootstrapOptions) {
    return {
      module: AppModule,
      imports: [
        PaymentsModule.withInfrastructure(
          PaymentsInfrastructureModule.use(options),
        ),
      ],
    };
  }
}
