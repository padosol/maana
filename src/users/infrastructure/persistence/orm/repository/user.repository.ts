import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersReposiotry } from 'src/users/application/ports/users.respository';
import { Users } from 'src/users/domain/users';
import { UsersMapper } from '../mappers/users.mapper';

@Injectable()
export class OrmUsersRepository implements UsersReposiotry {
  constructor(private readonly prismaService: PrismaService) {}

  async create(user: Users): Promise<Users> {
    const createdUser = await this.prismaService.users.create({
      data: {
        email: user.email,
        password: user.password!,
        role: user.role!,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return UsersMapper.toDomain(createdUser);
  }

  async findOneByEmail(email: string): Promise<Users | null> {
    const user = await this.prismaService.users.findUnique({
      where: { email },
    });

    if (!user) {
      return null;
    }

    return UsersMapper.toDomain(user);
  }

  async findOneById(id: bigint): Promise<Users | null> {
    const user = await this.prismaService.users.findUnique({
      where: { id },
    });

    if (!user) {
      return null;
    }

    return UsersMapper.toDomain(user);
  }

  async update(id: bigint, user: Users): Promise<Users> {
    const updatedUser = await this.prismaService.users.update({
      where: { id },
      data: {
        email: user.email,
        password: user.password!,
        role: user.role!,
      },
    });

    return UsersMapper.toDomain(updatedUser);
  }

  async remove(id: bigint): Promise<void> {
    await this.prismaService.users.delete({ where: { id } });
  }
}
