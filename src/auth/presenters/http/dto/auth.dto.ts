import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@example.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  password: string;
}
