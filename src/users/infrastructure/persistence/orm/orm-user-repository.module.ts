import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersReposiotry } from 'src/users/application/ports/users.respository';
import { OrmUsersRepository } from './repository/user.repository';

@Module({
  providers: [
    {
      provide: UsersReposiotry,
      useClass: OrmUsersRepository,
    },
  ],
  imports: [PrismaModule],
  exports: [UsersReposiotry],
})
export class OrmUserRepositoryModule {}
