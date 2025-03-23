import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from 'src/mail/mail.module';
import { GoogleOauthStrategy } from './strategies/google.strategy';

@Module({
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy, GoogleOauthStrategy],
  imports: [
    MailModule,
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => {
        return {
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '1hr' },
        };
      },
    }),
  ],

  exports: [JwtStrategy, PassportModule, JwtModule],
})
export class UsersModule { }
