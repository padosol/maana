import { Users } from 'src/users/domain/users';

export abstract class UsersReposiotry {
  abstract create(users: Users): Promise<Users>;
  abstract findOneByEmail(email: string): Promise<Users | null>;
  abstract findOneById(id: bigint): Promise<Users | null>;
  abstract update(id: bigint, users: Users): Promise<Users>;
  abstract remove(id: bigint): Promise<void>;
}
