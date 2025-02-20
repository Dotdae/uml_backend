import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsecaseService } from './usecase.service';
import { CreateUsecaseDto } from './dto/create-usecase.dto';
import { UpdateUsecaseDto } from './dto/update-usecase.dto';

@Controller('usecase')
export class UsecaseController {
  constructor(private readonly usecaseService: UsecaseService) {}

  @Post()
  create(@Body() createUsecaseDto: CreateUsecaseDto) {
    return this.usecaseService.create(createUsecaseDto);
  }

  @Get()
  findAll() {
    return this.usecaseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usecaseService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUsecaseDto: UpdateUsecaseDto) {
    return this.usecaseService.update(+id, updateUsecaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usecaseService.remove(+id);
  }
}
