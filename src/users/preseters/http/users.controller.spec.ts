import { Test, TestingModule } from '@nestjs/testing';
import { Role } from 'src/auth/roles/role.enum';
import { UsersController } from '../controller/users.controller';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', () => {
    const user = controller.create({
      email: 'test@test.com',
      password: 'test',
      role: Role.ADMIN,
    });

    expect(user).toBeDefined();
  });
});
