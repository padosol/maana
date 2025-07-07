import { PrismaClient } from '@prisma/client';

describe('OrmProductsPersistence', () => {
  let prisma: PrismaClient;

  beforeEach(async () => {
    prisma = new PrismaClient();

    await prisma.products.deleteMany();
    await prisma.category.deleteMany();
  });

  it('should update a product', async () => {
    const category = await prisma.category.create({
      data: {
        name: 'Category 1',
      },
    });

    const product = await prisma.products.create({
      data: {
        name: 'Product 1',
        description: 'Product 1 description',
        categoryId: category.id,
        price: 100,
        stock: 50,
      },
    });

    const productId = product.id;

    // 재고 감소 로직 테스트
    // 50 번 수행 후 재고가 0이 되어야 함
    for (let i = 0; i < 50; i++) {
      await prisma.products.update({
        where: { id: productId },
        data: { stock: { decrement: 1 } },
      });
    }

    const updatedProduct = await prisma.products.findUnique({
      where: { id: productId },
    });

    expect(updatedProduct?.stock).toBe(0);
  });
});
