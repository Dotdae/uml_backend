import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DiagramsService } from './diagrams.service';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('diagrams')
@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new diagram' })
  @ApiResponse({ status: 201, description: 'The diagram has been successfully created.' })
  create(@Body() createDiagramDto: CreateDiagramDto) {
    return this.diagramsService.create(createDiagramDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all diagrams or diagrams by project' })
  @ApiResponse({ status: 200, description: 'Return all diagrams.' })
  @ApiQuery({ name: 'projectId', required: false, type: Number })
  findAll(@Query('projectId') projectId?: number) {
    if (projectId) {
      return this.diagramsService.findByProject(projectId);
    }
    return this.diagramsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a diagram by id' })
  @ApiResponse({ status: 200, description: 'Return the diagram.' })
  @ApiResponse({ status: 404, description: 'Diagram not found.' })
  findOne(@Param('id') id: string) {
    return this.diagramsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a diagram' })
  @ApiResponse({ status: 200, description: 'The diagram has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Diagram not found.' })
  update(@Param('id') id: string, @Body() updateDiagramDto: Partial<CreateDiagramDto>) {
    return this.diagramsService.update(+id, updateDiagramDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a diagram' })
  @ApiResponse({ status: 200, description: 'The diagram has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Diagram not found.' })
  remove(@Param('id') id: string) {
    return this.diagramsService.remove(+id);
  }
} 