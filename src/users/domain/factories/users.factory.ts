import { Users } from '../users';

export class UsersFactory {
  create(email: string, password: string, role: string): Users {
    return new Users(null, email, password, role, new Date(), new Date());
  }
}
