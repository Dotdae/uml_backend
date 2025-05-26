// src/usuario/usuario.controller.ts
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus, ParseIntPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags, ApiBadRequestResponse, ApiNotFoundResponse, ApiNoContentResponse } from '@nestjs/swagger';
import { UsuarioDto } from './dto/usuario.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './interfaces/usuario.interface';

@Controller('usuario')
@ApiTags('usuario')
export class UsuarioController {

  private usuarios: Usuario[] = [
    { id: 1, username: 'john.doe', email: 'john.doe@example.com' },
    { id: 2, username: 'jane.doe', email: 'jane.doe@example.com' },
  ];

  @Get()
  @ApiOkResponse({ description: 'Returns all usuarios.', type: [UsuarioDto] })
  findAll(): Usuario[] {
    return this.usuarios;
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Returns a usuario by ID.', type: UsuarioDto })
  @ApiNotFoundResponse({ description: 'Usuario not found.' })
  findOne(@Param('id', ParseIntPipe) id: number): UsuarioDto {
    const usuario = this.usuarios.find(u => u.id === id);
    if (!usuario) {
      throw new Error('Usuario not found'); // Replace with proper exception handling
    }
    return usuario;
  }

  @Post()
  @ApiCreatedResponse({ description: 'The usuario has been successfully created.', type: UsuarioDto })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  create(@Body() createUsuarioDto: CreateUsuarioDto): UsuarioDto {
    const newUsuario: Usuario = {
      id: this.usuarios.length + 1,
      ...createUsuarioDto,
    };
    this.usuarios.push(newUsuario);
    return newUsuario;
  }

  @Put(':id')
  @ApiOkResponse({ description: 'The usuario has been successfully updated.', type: UsuarioDto })
  @ApiNotFoundResponse({ description: 'Usuario not found.' })
  @ApiBadRequestResponse({ description: 'Invalid input.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUsuarioDto: UpdateUsuarioDto): UsuarioDto {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuario not found'); // Replace with proper exception handling
    }

    this.usuarios[index] = { ...this.usuarios[index], ...updateUsuarioDto };
    return this.usuarios[index];
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({ description: 'The usuario has been successfully deleted.' })
  @ApiNotFoundResponse({ description: 'Usuario not found.' })
  remove(@Param('id', ParseIntPipe) id: number): void {
    const index = this.usuarios.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuario not found'); // Replace with proper exception handling
    }
    this.usuarios.splice(index, 1);
  }

  @Get('usa1')
  usa1(): string {
    return 'usa1';
  }
  @Get('usa2')
  usa2(): string {
    return 'usa2';
  }
  @Get('usa3')
  usa3(): string {
    return 'usa3';
  }
  @Get('usa4')
  usa4(): string {
    return 'usa4';
  }
  @Get('usa5')
  usa5(): string {
    return 'usa5';
  }
  @Get('usa6')
  usa6(): string {
    return 'usa6';
  }
  @Get('usa7')
  usa7(): string {
    return 'usa7';
  }
  @Get('usa8')
  usa8(): string {
    return 'usa8';
  }
  @Get('usa9')
  usa9(): string {
    return 'usa9';
  }
  @Get('usa10')
  usa10(): string {
    return 'usa10';
  }
  @Get('usa11')
  usa11(): string {
    return 'usa11';
  }
  @Get('usa12')
  usa12(): string {
    return 'usa12';
  }
  @Get('usa13')
  usa13(): string {
    return 'usa13';
  }
}