import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../preseters/http/dto/create-user.dto';
import { UpdateUserDto } from '../preseters/http/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { email, password, role } = createUserDto;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersRepository.createUser(createUserDto);

    return user;
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    return this.prismaService.users.findUnique({ where: { email } });
  }

  async findOneById(id: number): Promise<Users | null> {
    return this.prismaService.users.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.prismaService.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password } = updateUserDto;

    return this.prismaService.users.update({
      where: { id },
      data: {
        password: password ? await bcrypt.hash(password, 10) : user.password,
      },
    });
  }

  async remove(id: number) {
    const user = await this.prismaService.users.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prismaService.users.delete({ where: { id } });
  }
}
