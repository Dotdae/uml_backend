import { IsOptional, IsString, IsEmail, IsDateString, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ required: false, description: 'User full name' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ required: false, description: 'User phone number' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ required: false, description: 'User birthdate (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  birthdate?: string;

  @ApiProperty({ required: false, description: 'User avatar URL' })
  @IsOptional()
  @IsString()
  avatar?: string;
}
