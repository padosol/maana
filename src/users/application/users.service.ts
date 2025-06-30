import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersFactory } from '../domain/factories/users.factory';
import { Users } from '../domain/users';
import { UpdateUserDto } from '../preseters/http/dto/update-user.dto';
import { CreateUserCommand } from './commands/create-user.command';
import { UsersReposiotry } from './ports/users.respository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersReposiotry,
    private readonly usersFactory: UsersFactory,
  ) {}

  async create(command: CreateUserCommand) {
    const { email, password, role } = command;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersFactory.create(email, hashedPassword, role);

    const createdUser = await this.usersRepository.create(user);

    return createdUser;
  }

  async findOneByEmail(email: string): Promise<Users> {
    const user = await this.usersRepository.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findOneById(id: bigint): Promise<Users> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: bigint, updateUserDto: UpdateUserDto): Promise<Users> {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password } = updateUserDto;

    const updatedUser = await this.usersRepository.update(
      id,
      this.usersFactory.create(
        user.email,
        password ? await bcrypt.hash(password, 10) : user.password!,
        user.role!,
      ),
    );

    return updatedUser;
  }

  async remove(id: bigint) {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.usersRepository.remove(id);
  }
}
