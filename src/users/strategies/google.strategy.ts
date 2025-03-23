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
      // passReqToCallback: true,
    });
  }

  async validate(
    access_token: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    console.log('GoogleOauthStrategy validate method called');
    console.log(profile);
    const email = profile.emails[0]?.value;
    const user = await this.userService.validateGoogleUser({
      email,
      fullName: profile.displayName,
      lastName: profile.name.familyName,
      avatarUrl: profile.photos[0].value,
      password: '',
    });

    profile = null;

    console.log('User validated:', user);
    done(null, user);
  }
}
