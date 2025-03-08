import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';

@Module({
  providers: [MailService],
  imports: [
    ConfigModule.forRoot(),

    MailerModule.forRoot({
      transport: {
        host: process.env.MAILER_HOST,
        port: +process.env.MAILER_PORT,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD,
        },
      },
      template: {
        dir: join(__dirname, '..', '..', 'src', 'mail', 'templates'),
        adapter: new HandlebarsAdapter(),
        options: { strict: true },
      },
    }),
  ],
  exports: [MailService],
})
export class MailModule { }
