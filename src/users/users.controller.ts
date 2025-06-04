import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Res,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { GetRawHeaders } from './decorators/get-raw-headers.decorator';
import { Response, Request } from 'express';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth, ApiCookieAuth } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post('register')
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with email verification. An email with verification code will be sent to the provided email address.'
  })
  @ApiBody({
    description: 'User registration data',
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Standard registration',
        value: {
          email: 'john.doe@example.com',
          fullName: 'John Doe',
          password: 'SecurePassword123!'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully registered. Verification email sent.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User registered successfully. Please check your email for verification.' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid-123' },
            email: { type: 'string', example: 'john.doe@example.com' },
            fullName: { type: 'string', example: 'John Doe' },
            isActive: { type: 'boolean', example: false },
            isVerified: { type: 'boolean', example: false },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['email must be a valid email', 'password must be at least 8 characters'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Email already exists.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'User with this email already exists' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user with email and password. Returns access token and sets refresh token as HTTP-only cookie.'
  })
  @ApiBody({
    description: 'User login credentials',
    type: LoginUserDto,
    examples: {
      example1: {
        summary: 'Standard login',
        value: {
          email: 'john.doe@example.com',
          password: 'SecurePassword123!'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid-123' },
            email: { type: 'string', example: 'john.doe@example.com' },
            fullName: { type: 'string', example: 'John Doe' },
            isActive: { type: 'boolean', example: true },
            isVerified: { type: 'boolean', example: true }
          }
        }
      }
    },
    headers: {
      'Set-Cookie': {
        description: 'Refresh token stored as HTTP-only cookie',
        schema: { type: 'string', example: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; SameSite=Strict' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid credentials.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid email or password' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Account not verified.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'Please verify your email before logging in' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  login(@Body() loginUserDto: LoginUserDto, @Res() res: Response) {
    return this.usersService.login(loginUserDto, res);
  }

  @Post('logout')
  @ApiOperation({
    summary: 'User logout',
    description: 'Logs out the user by clearing the refresh token cookie. Can be called without authentication.'
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Successfully logged out' }
      }
    },
    headers: {
      'Set-Cookie': {
        description: 'Refresh token cookie cleared',
        schema: { type: 'string', example: 'refreshToken=; HttpOnly; Max-Age=0' }
      }
    }
  })
  logout(@Res() res: Response) {
    console.log('Logout called in controller');
    return this.usersService.logout(res);
  }

  @Get('verify/:email/:code')
  @ApiOperation({
    summary: 'Verify email address',
    description: 'Verifies a user\'s email address using the verification code sent to their email.'
  })
  @ApiParam({
    name: 'email',
    type: 'string',
    description: 'The email address to verify',
    example: 'john.doe@example.com'
  })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'The verification code sent to the email',
    example: 'ABC123XYZ789'
  })
  @ApiResponse({
    status: 200,
    description: 'Email successfully verified.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Email verified successfully' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid-123' },
            email: { type: 'string', example: 'john.doe@example.com' },
            fullName: { type: 'string', example: 'John Doe' },
            isActive: { type: 'boolean', example: true },
            isVerified: { type: 'boolean', example: true }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid verification code.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid verification code or code expired' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  verifyEmail(@Param('email') email: string, @Param('code') code: string) {
    return this.usersService.verifyEmail(email, code);
  }

  @Post('reset-password')
  @ApiOperation({
    summary: 'Request password reset',
    description: 'Sends a password reset code to the user\'s email address. The code can be used to reset the password.'
  })
  @ApiBody({
    description: 'Email address to send reset code to',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email', example: 'john.doe@example.com' }
      },
      required: ['email']
    },
    examples: {
      example1: {
        summary: 'Request password reset',
        value: {
          email: 'john.doe@example.com'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Password reset code sent to email.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password reset code sent to your email' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User with this email not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  resetPassword(@Body() { email }: { email: string }) {
    return this.usersService.requestResetPassword(email);
  }

  @Post('reset-password/:email/:code')
  @ApiOperation({
    summary: 'Reset password with code',
    description: 'Resets the user\'s password using the reset code sent to their email.'
  })
  @ApiParam({
    name: 'email',
    type: 'string',
    description: 'The email address of the user',
    example: 'john.doe@example.com'
  })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'The password reset code sent to the email',
    example: 'RST456DEF789'
  })
  @ApiBody({
    description: 'New password',
    schema: {
      type: 'object',
      properties: {
        password: { type: 'string', minLength: 8, example: 'NewSecurePassword123!' }
      },
      required: ['password']
    },
    examples: {
      example1: {
        summary: 'Reset password',
        value: {
          password: 'NewSecurePassword123!'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Password successfully reset.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Password reset successfully' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid reset code or weak password.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Invalid reset code or code expired' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'User not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'User not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  resetPasswordConfirm(
    @Param('email') email: string,
    @Param('code') code: string,
    @Body() { password }: { password: string },
  ) {
    return this.usersService.resetPassword(email, code, password);
  }

  @Get('refresh-token')
  @ApiCookieAuth('refreshToken')
  @ApiOperation({
    summary: 'Refresh access token',
    description: 'Generates a new access token using the refresh token stored in HTTP-only cookie.'
  })
  @ApiResponse({
    status: 200,
    description: 'Access token successfully refreshed.',
    schema: {
      type: 'object',
      properties: {
        accessToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid-123' },
            email: { type: 'string', example: 'john.doe@example.com' },
            fullName: { type: 'string', example: 'John Doe' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing refresh token.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Invalid refresh token' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.usersService.refreshToken(req, res);
  }

  @Get('private')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Test private endpoint',
    description: 'Testing endpoint for authenticated users only. Returns user data and request headers for debugging purposes.'
  })
  @ApiResponse({
    status: 200,
    description: 'Returns authenticated user data and request headers.',
    schema: {
      type: 'object',
      properties: {
        user: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user-uuid-123' },
            email: { type: 'string', example: 'john.doe@example.com' },
            fullName: { type: 'string', example: 'John Doe' },
            isActive: { type: 'boolean', example: true },
            isVerified: { type: 'boolean', example: true }
          }
        },
        userEmail: {
          type: 'object',
          description: 'User object for email property access'
        },
        rawHeader: {
          type: 'array',
          items: { type: 'string' },
          example: ['authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...']
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  testingPrivate(
    @GetUser('email') userEmail: User,
    @GetUser() user: User,
    @GetRawHeaders() rawHeader: string[],
  ) {
    return {
      rawHeader,
      user,
      userEmail,
    };
  }

  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  @ApiOperation({
    summary: 'Google OAuth login',
    description: 'Initiates Google OAuth login flow. Redirects to Google authentication page.'
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to Google OAuth authorization URL.',
    headers: {
      'Location': {
        description: 'Google OAuth authorization URL',
        schema: { type: 'string', example: 'https://accounts.google.com/oauth/authorize?...' }
      }
    }
  })
  googleLogin() { }

  @UseGuards(GoogleAuthGuard)
  @Get('google/callback')
  @ApiOperation({
    summary: 'Google OAuth callback',
    description: 'Handles Google OAuth callback after successful authentication. Sets tokens and redirects to frontend.'
  })
  @ApiResponse({
    status: 302,
    description: 'Redirects to frontend with access token.',
    headers: {
      'Location': {
        description: 'Frontend callback URL with access token',
        schema: { type: 'string', example: 'http://localhost:4200/auth/google-callback?accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }
      },
      'Set-Cookie': {
        description: 'Refresh token stored as HTTP-only cookie',
        schema: { type: 'string', example: 'refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; SameSite=Strict' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Google authentication failed.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Google authentication failed' },
        error: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  async googleCallback(@Req() req, @Res() res) {
    console.log('googleCallback method called');
    console.log('req.user:', req.user);

    const requestUser = req.user.user;

    const { user, accessToken, refreshToken } =
      await this.usersService.validateGoogleUser(requestUser);

    console.log('User after callback:', user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      sameSite: 'strict',
      // secure: process.env.NODE_ENV === 'production',
    });
    return res.redirect(
      `${process.env.FRONTEND_URL}/auth/google-callback?accessToken=${accessToken}`,
    );
  }

  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieves the authenticated user\'s profile information including current account status.'
  })
  @ApiResponse({
    status: 200,
    description: 'User profile data retrieved successfully.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'user-uuid-123' },
        email: { type: 'string', example: 'john.doe@example.com' },
        fullName: { type: 'string', example: 'John Doe' },
        isActive: { type: 'boolean', example: true },
        isVerified: { type: 'boolean', example: true }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async getProfile(@GetUser() user: User, @Req() req: Request) {
    console.log('Profile request received');
    console.log('Auth header:', req.headers.authorization);
    console.log('User from @GetUser():', user);

    // Get fresh user data from database
    const freshUser = await this.usersService.findOneBy(user.id);
    console.log('Fresh user data:', freshUser);

    return {
      id: freshUser.id,
      email: freshUser.email,
      fullName: freshUser.fullName,
      isActive: freshUser.isActive,
      isVerified: freshUser.isVerified
    };
  }
}
