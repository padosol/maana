import { Users } from '@prisma/client';

export class UsersMapper {
  static toDomain(user: Users): Users {
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
