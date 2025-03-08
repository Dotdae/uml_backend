import { Controller, Post, Body, Get, UseGuards, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeaders } from './decorators/get-raw-headers.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }

  @Get('verify/:email/:code')
  verifyEmail(@Param('email') email: string, @Param('code') code: string) {
    return this.usersService.verifyEmail(email, code);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivate(
    @GetUser('email') userEmail: User,
    @GetUser() user: User,
    @GetRawHeaders() rawHeader: string[],
  ) {
    return {
      rawHeader,
      user,
      userEmail,
    };
  }
}
