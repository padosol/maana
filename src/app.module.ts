import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [UserModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
