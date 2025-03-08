import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async sendVerificationEmail(email: string, name: string, code: string) {
    const verificationLink = `http://localhost:3000/api/users/verify/${email}/${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify Your Email',
      template: 'verification-email', // points to templates/verification-email.hbs
      context: { name, verificationLink }, // Pass data to template
    });
  }

  async sendResetPasswordEmail(email: string, name: string, code: string) {
    const resetPasswordLink = `http://localhost:3000/api/users/reset-password/${email}/${code}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset Your Password',
      template: 'reset-password-email',
      context: { name, resetPasswordLink },
    });
  }
}
