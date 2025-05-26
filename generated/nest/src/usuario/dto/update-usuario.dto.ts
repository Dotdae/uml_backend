// src/usuario/dto/update-usuario.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEmail } from 'class-validator';

export class UpdateUsuarioDto {
  @ApiPropertyOptional({ description: 'The username of the usuario' })
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: 'The email of the usuario' })
  @IsOptional()
  @IsEmail()
  email?: string;
}