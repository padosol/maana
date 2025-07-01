import { Module } from '@nestjs/common';
import { UsersFactory } from '../domain/factories/users.factory';
import { UsersInfrastructureModule } from '../infrastructure/users-infrastructure.module';
import { UsersController } from '../preseters/http/users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersFactory],
  imports: [UsersInfrastructureModule],
  exports: [UsersService],
})
export class UsersModule {}
