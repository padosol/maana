import { Users as PrismaUsers } from '@prisma/client';
import { Users } from 'src/users/domain/users';

export class UsersMapper {
  static toDomain(user: PrismaUsers): Users {
    return new Users(
      user.id,
      user.email,
      user.password,
      user.role,
      user.createdAt,
      user.updatedAt,
    );
  }
}
