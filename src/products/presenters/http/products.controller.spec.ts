import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from 'src/products/application/products.service';
import { CreateProductDto } from 'src/products/presenters/http/dto/create-product.dto';
import { ProductsController } from './products.controller';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            createProduct: jest.fn().mockResolvedValue({
              id: 1,
              name: 'Product 1',
              price: '100',
              description: 'Product 1 description',
              stock: 10,
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should be success create product', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Product 1',
        description: 'Product 1 description',
        price: 100,
        stock: 10,
        categoryId: 1,
      };

      const expected = {
        id: 1,
        name: 'Product 1',
        price: '100',
        description: 'Product 1 description',
        stock: 10,
        category: {
          id: 1,
          name: '노트북',
          description: '',
          parentId: null,
        },
        imageUrl: '',
        isActive: true,
      };

      const result = await controller.createProduct(createProductDto);
      expect(result).toEqual(expected);
    });
  });
});
