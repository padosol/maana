import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/application/orders.module';
import { ProductsModule } from 'src/products/application/products.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [OrdersModule, ProductsModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
