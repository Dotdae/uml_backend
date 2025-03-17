import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { UsersService } from '../users.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    access_token: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user = await this.userService.validateGoogleUser({
      email: profile.email,
      fullName: profile.displayName,
      lastName: profile.name.familyName,
      avatarUrl: profile.photos[0].value,
      password: '',
    });
    done(null, user);
  }
}
