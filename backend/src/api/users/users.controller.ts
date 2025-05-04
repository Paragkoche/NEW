import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDTO } from './dto/login.dto';
import { CreateDTO } from './dto/register.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  Login(@Body() user: LoginDTO) {
    return this.usersService.Login(user);
  }
  @Post('create-user')
  Create(@Body() user_data: CreateDTO) {
    return this.usersService.Create(user_data);
  }
}
