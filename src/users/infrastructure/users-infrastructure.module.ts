import { Module } from '@nestjs/common';
import { OrmUsersRepository } from './persistence/orm/repository/user.repository';

@Module({
  providers: [],
  exports: [OrmUsersRepository],
  imports: [OrmUsersRepository],
})
export class UsersInfrastructureModule {}
