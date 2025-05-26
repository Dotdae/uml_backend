// src/usuario/dto/usuario.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class UsuarioDto {
  @ApiProperty({ description: 'The ID of the usuario' })
  id: number;

  @ApiProperty({ description: 'The username of the usuario' })
  username: string;

  @ApiProperty({ description: 'The email of the usuario' })
  email: string;
}