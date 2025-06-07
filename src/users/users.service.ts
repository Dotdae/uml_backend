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
import * as fs from 'fs';
import * as path from 'path';

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
    const accessToken = this.generateJwtToken({ id: user.id });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.json({ token: accessToken });
  }

  logout(res: Response) {
    this.logger.log('Logout called');
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
    });
    res.clearCookie('accessToken', {
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
      const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN) as any;
      console.log('Refresh token payload:', payload);

      // Use the id from the payload, not sub
      const userId = payload.id;
      if (!userId) {
        throw new UnauthorizedException('Invalid refresh token payload');
      }

      const newAccessToken = this.generateJwtToken({ id: userId });

      const newRefreshToken = jwt.sign(
        { id: userId },
        process.env.JWT_REFRESH_TOKEN,
        { expiresIn: '7d' },
      );

      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });
      console.log('Refresh token: ', newRefreshToken);
      console.log('New access token: ', newAccessToken);
      console.log('Payload: ', payload);

      console.log('New access token generated for user:', userId);
      return res.json({ token: newAccessToken, refreshToken: newRefreshToken });
    } catch (err) {
      console.log('Refresh token error:', err);
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
    console.log('Validating Google user:', googleUser);
    let user = await this.userRepository.findOne({
      where: { email: googleUser.email },
    });
    console.log('Existing user:', user);

    if (!user) {
      user = await this.createGoogleUser(googleUser);
    } else {
      // Update existing user's Google profile information
      user.fullName = googleUser.fullName;
      user.lastName = googleUser.lastName;
      user.avatarUrl = googleUser.avatarUrl;
      user.isGoogleUser = true;
      user.isVerified = true;
      user.isActive = true;
      user = await this.userRepository.save(user);
    }

    const accessToken = this.generateJwtToken({ id: user.id });
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_TOKEN,
      { expiresIn: '7d' },
    );

    return { user, accessToken, refreshToken };
  }

  private async createGoogleUser(googleUser: any) {
    const plainPassword = Math.random().toString(36).substring(2, 9);

    const user = this.userRepository.create({
      email: googleUser.email,
      password: bcrypt.hashSync(plainPassword, 10),
      fullName: googleUser.fullName,
      lastName: googleUser.lastName,
      avatarUrl: googleUser.avatarUrl,
      isGoogleUser: true,
      isVerified: true,
      isActive: true,
    });

    return await this.userRepository.save(user);
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

  async updateProfile(userId: string, updateUserDto: UpdateUserDto) {
    // Find the user
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user with new data
    Object.assign(user, updateUserDto);

    // Save the updated user
    const updatedUser = await this.userRepository.save(user);

    // Return user data without password
    const { password, verificationCode, resetCode, resetExpires, ...userResponse } = updatedUser;

    return {
      message: 'Profile updated successfully',
      user: userResponse
    };
  }

  async uploadAvatar(userId: string, file: any) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPG, PNG, and SVG are allowed.');
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum size is 10MB.');
    }

    // Find the user
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    try {
      // Create uploads directory if it doesn't exist
      const uploadsDir = path.join(process.cwd(), 'uploads', 'avatars');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${userId}_${Date.now()}${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);

      // Save file to disk
      fs.writeFileSync(filePath, file.buffer);

      // Create URL for the saved file
      const avatarUrl = `/uploads/avatars/${fileName}`;

      // Update user's avatar field
      user.avatar = avatarUrl;
      await this.userRepository.save(user);

      return {
        message: 'Avatar uploaded successfully',
        avatarUrl: avatarUrl
      };
    } catch (error) {
      this.logger.error('Error saving avatar file:', error);
      throw new InternalServerErrorException('Failed to save avatar file');
    }
  }
}
