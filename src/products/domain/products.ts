import { BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { Category } from './category';

export class Product {
  constructor(
    public readonly id: bigint | null,
    public name: string,
    public price: Decimal,
    public description: string,
    public stock: number,
    public category: Category,
    public imageUrl: string | null,
    public isActive: boolean,
  ) {}

  decreaseStock(quantity: number) {
    if (this.stock < quantity) {
      throw new BadRequestException('Stock is not enough');
    }

    this.stock -= quantity;
  }
}
