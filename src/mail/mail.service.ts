import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  public url: string = process.env.BACKEND_URL;
  constructor(private readonly mailerService: MailerService) { }

  async sendVerificationEmail(email: string, name: string, code: string) {
    const verificationLink = `${this.url}/users/verify/${email}/${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Email',
      template: 'verification-email', // points to templates/verification-email.hbs
      context: { name, verificationLink }, // Pass data to template
    });
  }

  async sendResetPasswordEmail(email: string, name: string, code: string) {
    const resetPasswordLink = `${this.url}/users/reset-password/${email}/${code}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      template: 'reset-password-email',
      context: { name, resetPasswordLink },
    });
  }
}
