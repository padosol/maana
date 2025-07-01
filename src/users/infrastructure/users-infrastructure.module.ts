import { Module } from '@nestjs/common';
import { OrmUserRepositoryModule } from './persistence/orm/orm-user-repository.module';

@Module({
  imports: [OrmUserRepositoryModule],
  exports: [OrmUserRepositoryModule],
})
export class UsersInfrastructureModule {}
