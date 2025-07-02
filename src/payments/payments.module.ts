import { Module } from '@nestjs/common';
import { OrdersModule } from 'src/orders/application/orders.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/application/products.module';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [OrdersModule, ProductsModule, PrismaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
