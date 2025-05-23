import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Res,
  Req,
  Redirect,
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
import { ConfigService } from '@nestjs/config';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) { }

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

  @Get('google/login')
  @Redirect()
  googleLogin() {
    const clientId = this.configService.get<string>('GOOGLE_CLIENT_ID');
    const callbackUrl = this.configService.get<string>('GOOGLE_CALLBACK_URL');
    
    const googleAuthUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: callbackUrl,
      response_type: 'code',
      scope: 'email profile',
      prompt: 'select_account',
      access_type: 'offline'
    });

    return { url: `${googleAuthUrl}?${params.toString()}` };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  async googleCallback(@Req() req, @Res() res) {
    console.log('Google callback received:', req.user);

    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/auth/login?error=authentication_failed`);
    }

    // req.user is already the result from the Google strategy
    const { user, accessToken, refreshToken } = req.user;

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      // secure: process.env.NODE_ENV === 'production',
    });

    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/google-callback?accessToken=${accessToken}`,
    );
  }

  @Get('profile')
  @UseGuards(AuthGuard())
  async getProfile(@GetUser() user: User, @Req() req: Request) {
    console.log('Profile request received');
    console.log('Auth header:', req.headers.authorization);
    console.log('User from @GetUser():', user);

    // Get fresh user data from database
    const freshUser = await this.usersService.findOneBy(user.id);
    console.log('Fresh user data:', freshUser);

    return {
      id: freshUser.id,
      email: freshUser.email,
      fullName: freshUser.fullName,
      lastName: freshUser.lastName,
      avatarUrl: freshUser.avatarUrl,
      isGoogleUser: freshUser.isGoogleUser,
      isActive: freshUser.isActive,
      isVerified: freshUser.isVerified
    };
  }
}
