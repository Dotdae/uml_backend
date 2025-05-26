// src/usuario/dto/create-usuario.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'The username of the usuario' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'The email of the usuario' })
  @IsNotEmpty()
  @IsEmail()
  email: string;
}