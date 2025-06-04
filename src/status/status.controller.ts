import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';

@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create(createStatusDto);
  }

  @Post('seed')
  seedDefaultStatuses() {
    return this.statusService.seedDefaultStatuses();
  }

  @Get()
  findAll() {
    return this.statusService.findAll();
  }

  @Get('with-projects')
  findAllWithProjects() {
    return this.statusService.findAllWithProjects();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: CreateStatusDto,
  ) {
    return this.statusService.update(id, updateStatusDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.remove(id);
  }
}
