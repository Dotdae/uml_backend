import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiagramTypeService } from './diagram-type.service';
import { CreateDiagramTypeDto } from './dto/create-diagram-type.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('diagram-types')
@Controller('diagram-types')
export class DiagramTypeController {
  constructor(private readonly diagramTypeService: DiagramTypeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new diagram type' })
  @ApiResponse({ status: 201, description: 'The diagram type has been successfully created.' })
  create(@Body() createDiagramTypeDto: CreateDiagramTypeDto) {
    return this.diagramTypeService.create(createDiagramTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all diagram types' })
  @ApiResponse({ status: 200, description: 'Return all diagram types.' })
  findAll() {
    return this.diagramTypeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a diagram type by id' })
  @ApiResponse({ status: 200, description: 'Return the diagram type.' })
  @ApiResponse({ status: 404, description: 'Diagram type not found.' })
  findOne(@Param('id') id: string) {
    return this.diagramTypeService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a diagram type' })
  @ApiResponse({ status: 200, description: 'The diagram type has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Diagram type not found.' })
  update(@Param('id') id: string, @Body() updateDiagramTypeDto: Partial<CreateDiagramTypeDto>) {
    return this.diagramTypeService.update(+id, updateDiagramTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a diagram type' })
  @ApiResponse({ status: 200, description: 'The diagram type has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Diagram type not found.' })
  remove(@Param('id') id: string) {
    return this.diagramTypeService.remove(+id);
  }
} 