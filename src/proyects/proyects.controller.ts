import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProyectsService } from './proyects.service';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';

@Controller('proyects')
export class ProyectsController {
  constructor(private readonly proyectsService: ProyectsService) {}

  //Endpoint para crear un nuevo proyecto
  @Post('create')
  create(@Body() createProyectDto: CreateProyectDto) {
    return this.proyectsService.create(createProyectDto);
  }

  @Get()
  findAll() {
    return this.proyectsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.proyectsService.findOne(+id);
  }

  // Endpoint para obtener todos los proyectos de un usuario específico
  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.proyectsService.findAllByUser(userId);
  }

  //Endpoint para actualizar el nombre de un proyecto
  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updateProyectDto: UpdateProyectDto) {
    return this.proyectsService.update(+id, updateProyectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectsService.deleteProjectById(+id);
  }

  @Get('diagrams/:id')
  // Endpoint para obtener todos los diagramas de un proyecto específico
  getProjectDiagrams(@Param('id') id: number) {
    return this.proyectsService.getProjectDiagrams(id);
  }
}
