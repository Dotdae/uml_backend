import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Res,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeaders } from './decorators/get-raw-headers.decorator';
import { Response, Request } from 'express';
import { GoogleAuthGuard } from './guards/google-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.usersService.login(loginUserDto, res);
  }

  @Post('logout')
  logout(@Res() res: Response) {
    return this.usersService.logout(res);
  }

  @Get('verify/:email/:code')
  verifyEmail(@Param('email') email: string, @Param('code') code: string) {
    return this.usersService.verifyEmail(email, code);
  }

  @Post('reset-password')
  resetPassword(@Body() { email }: { email: string }) {
    return this.usersService.requestResetPassword(email);
  }

  @Post('reset-password/:email/:code')
  resetPasswordConfirm(
    @Param('email') email: string,
    @Param('code') code: string,
    @Body() { password }: { password: string },
  ) {
    return this.usersService.resetPassword(email, code, password);
  }

  @Get('refresh-token')
  refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.usersService.refreshToken(req, res);
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

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() { }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    console.log('googleCallback method called');
    console.log('req.user:', req.user);

    const requestUser = req.user.user;

    const { user, accessToken, refreshToken } =
      await this.usersService.validateGoogleUser(requestUser);

    console.log('User after callback:', user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      // secure: process.env.NODE_ENV === 'production',
    });
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/google-callback?accessToken=${accessToken}`,
    );
  }
}
