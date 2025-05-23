import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { ComponentService } from './component.service';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Component } from './entities/component.entity';


@Controller('component')
export class ComponentController {
  constructor(private readonly componentService: ComponentService) {}

  @Post('create')
  async create(@Body() createComponentDto: CreateComponentDto): Promise<Component> {
    return await this.componentService.create(createComponentDto);
  }

  @Get()
  findAll() {
    return this.componentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.componentService.findOne(+id);
  }

  // 🔹 Actualizar un componente
  @Patch('/update/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateComponentDto: UpdateComponentDto,
  ): Promise<Component> {
    return await this.componentService.update(id, updateComponentDto);
  }
// 🔹 Eliminar un componente
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.componentService.remove(id);
  }
}
