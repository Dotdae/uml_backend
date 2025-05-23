import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, StrategyOptionsWithRequest } from 'passport-google-oauth2';
import { UsersService } from '../users.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UsersService,
  ) {
    const config: StrategyOptionsWithRequest = {
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_CALLBACK_URL'),
      scope: ['email', 'profile'],
      passReqToCallback: true
    };

    super(config);
  }

  async validate(
    request: any,
    access_token: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    try {
      console.log('GoogleOauthStrategy validate method called');
      console.log('Raw Google profile:', profile);

      // Extract email from profile
      const email = profile.emails[0]?.value;
      if (!email) {
        throw new Error('No email found in Google profile');
      }

      // Map Google profile data correctly
      const googleUser = {
        email: email,
        fullName: profile.name.givenName || profile.displayName.split(' ')[0],
        lastName: profile.name.familyName || profile.displayName.split(' ').slice(1).join(' '),
        avatarUrl: profile.photos[0]?.value,
        isGoogleUser: true
      };

      console.log('Mapped Google user data:', googleUser);

      const user = await this.userService.validateGoogleUser(googleUser);
      console.log('Validated user:', user);

      return done(null, user);
    } catch (error) {
      console.error('Error in Google strategy validation:', error);
      return done(error, null);
    }
  }
}
