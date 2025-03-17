import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import * as jwt from 'jsonwebtoken';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto';
import { Response, Request } from 'express';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailService: MailService,
    private readonly jwtService: JwtService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const verificationCode = crypto.randomInt(100000, 999999).toString();

      const user = this.userRepository.create({
        ...userData,
        verificationCode,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      await this.mailService.sendVerificationEmail(
        user.email,
        user.fullName,
        verificationCode,
      );

      return { ...user, token: this.generateJwtToken({ id: user.id }) };
    } catch (error) {
      this.handleExceptionsDB(error);
    }
  }

  async login(loginUserDto: LoginUserDto, res: Response) {
    const user = await this.userRepository.findOne({
      where: { email: loginUserDto.email },
      select: {
        email: true,
        password: true,
        id: true,
        isVerified: true,
        isActive: true,
      },
    });

    // console.log(user);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials (email)');
    }
    const isPasswordValid = bcrypt.compareSync(
      loginUserDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials (password)');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('Email not verified');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is not active');
    }

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_TOKEN,
      {
        expiresIn: '7d',
      },
    );

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.json({ token: this.generateJwtToken({ id: user.id }) });
  }

  logout(res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
    });
    return { message: 'Logout successful' };
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneBy(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  refreshToken(req: Request, res: Response) {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found');
    }

    try {
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

      const newAccessToken = this.jwtService.sign({ sub: payload.sub });

      return res.json({ token: newAccessToken });
    } catch (err) {
      console.log(err);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async verifyEmail(email: string, code: string) {
    console.log(email, code);
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');
    if (user.isVerified) throw new BadRequestException('User already verified');
    if (user.verificationCode !== code)
      throw new BadRequestException('Invalid verification code');

    user.isVerified = true;
    user.isActive = true;
    user.verificationCode = null;

    await this.userRepository.save(user);

    return { message: 'Email successfully verified!' };
  }

  async requestResetPassword(email: string) {
    if (!email) throw new BadRequestException('Email is required');
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    const resetCode = crypto.randomInt(100000, 999999).toString();
    user.resetCode = resetCode;
    user.resetExpires = new Date(Date.now() + 3600000);
    await this.userRepository.save(user);
    await this.mailService.sendResetPasswordEmail(
      user.email,
      user.fullName,
      user.resetCode,
    );
    return { message: 'Reset password email sent' };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.userRepository.findOne({
      where: { email, resetCode: code, resetExpires: MoreThan(new Date()) },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset code');
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    user.resetCode = null;
    user.resetExpires = null;
    await this.userRepository.save(user);
    return { message: 'Password successfully reset' };
  }

  async validateGoogleUser(googleUser: any) {
    let user = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });

    if (!user) {
      user = this.createGoogleUser(googleUser);
    }

    const accessToken = this.generateJwtToken({ id: user.id });
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: '7d' },
    );

    return { user, accessToken, refreshToken };
  }

  private createGoogleUser(googleUser: any) {
    const plainPassowrd = Math.random().toString(36).substring(2, 9);

    const user = this.userRepository.create({
      email: googleUser.email,
      password: bcrypt.hashSync(plainPassowrd, 10),
      fullName: googleUser.fullName,
      isVerified: true,
      isActive: true,
    });
    // console.log(user);
    this.userRepository.save(user);

    return user;
  }

  private handleExceptionsDB(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check logs');
  }

  private generateJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
