import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { CreateOrderItemCommand } from 'src/orders/application/commands/create-order-item.command';
import { CreateOrderCommand } from '../../application/commands/create-order.command';
import { OrdersService } from '../../application/orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: '주문 생성 API' })
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(
      new CreateOrderCommand(
        createOrderDto.userId,
        createOrderDto.items.map(
          (item) => new CreateOrderItemCommand(item.productId, item.quantity),
        ),
      ),
    );
  }

  @Get()
  @ApiOperation({ summary: '주문 목록 조회 API' })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '주문 상세 조회 API' })
  findOne(@Param('id') id: bigint) {
    return this.ordersService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '주문 상태 업데이트 API' })
  updateOrderStatus(
    @Param('id') id: bigint,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, updateOrderStatusDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '주문 삭제 API' })
  remove(@Param('id') id: bigint) {
    return this.ordersService.remove(id);
  }
}
