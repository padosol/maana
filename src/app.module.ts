import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/application/auth.module';
import { OrdersModule } from './orders/application/orders.module';
import { PaymentsModule } from './payments/payments.module';
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
    PaymentsModule,
  ],
})
export class AppModule {}
