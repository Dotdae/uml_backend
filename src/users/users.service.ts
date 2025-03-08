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
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import * as crypto from 'crypto';

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

  async login(loginUserDto: LoginUserDto) {
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

    console.log(user);
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
    return { ...user, token: this.generateJwtToken({ id: user.id }) };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
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
