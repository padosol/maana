import { Module } from '@nestjs/common';
import { UsersReposiotry } from 'src/users/application/ports/users.respository';
import { OrmUsersRepository } from './repository/user.repository';

@Module({
  providers: [
    {
      provide: UsersReposiotry,
      useClass: OrmUsersRepository,
    },
  ],
  exports: [UsersReposiotry],
})
export class OrmUserRepositoryModule {}
