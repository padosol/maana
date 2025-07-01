import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';
import { Role } from 'src/auth/presenters/roles/role.enum';
import { Roles } from 'src/auth/presenters/roles/roles.decorator';
import { JwtGuard } from '../../../auth/presenters/jwt/jwt.guard';
import { UsersService } from '../../application/users.service';
import { Users } from '../../domain/users';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<Users> {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('profile')
  async getProfile(@Req() req: Request): Promise<Users> {
    return req.user as Users;
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('admin')
  @Roles(Role.ADMIN)
  async adminRole(): Promise<string> {
    return 'admin';
  }

  @Roles(Role.USER)
  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get('user')
  async userRole(): Promise<string> {
    return 'user';
  }
}
