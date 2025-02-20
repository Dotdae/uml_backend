import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProyectsService } from './proyects.service';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';

@Controller('proyects')
export class ProyectsController {
  constructor(private readonly proyectsService: ProyectsService) {}

  @Post()
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProyectDto: UpdateProyectDto) {
    return this.proyectsService.update(+id, updateProyectDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.proyectsService.remove(+id);
  }
}
