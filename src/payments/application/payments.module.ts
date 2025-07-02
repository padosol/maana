import { DynamicModule, Module, Type } from '@nestjs/common';
import { OrdersModule } from 'src/orders/application/orders.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/application/products.module';
import { PaymentsController } from '../presenters/http/payments.controller';
import { PaymentsService } from './payments.service';

@Module({
  imports: [OrdersModule, ProductsModule, PrismaModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {
  static withInfrastructure(infrastructureModuel: Type | DynamicModule) {
    return {
      module: PaymentsModule,
      imports: [infrastructureModuel],
    };
  }
}
