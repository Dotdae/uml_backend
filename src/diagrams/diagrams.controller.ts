import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { DiagramsService } from './diagrams.service';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('diagrams')
@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new diagram',
    description: 'Creates a new UML diagram within a project. Supports various diagram types like class, sequence, use case, etc.'
  })
  @ApiBody({
    description: 'Diagram data to create',
    type: CreateDiagramDto,
    examples: {
      classExample: {
        summary: 'Class diagram',
        value: {
          name: 'User Management Classes',
          type: 'class',
          content: '{"nodes": [{"id": "1", "type": "class", "data": {"label": "User"}}], "edges": []}',
          projectId: 1
        }
      },
      sequenceExample: {
        summary: 'Sequence diagram',
        value: {
          name: 'Login Process Flow',
          type: 'sequence',
          content: '{"nodes": [{"id": "1", "type": "actor", "data": {"label": "User"}}], "edges": []}',
          projectId: 1
        }
      },
      usecaseExample: {
        summary: 'Use case diagram',
        value: {
          name: 'System Use Cases',
          type: 'usecase',
          content: '{"nodes": [{"id": "1", "type": "actor", "data": {"label": "Customer"}}], "edges": []}',
          projectId: 1
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The diagram has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'User Management Classes' },
        type: { type: 'string', example: 'class', enum: ['class', 'sequence', 'usecase', 'component', 'package'] },
        content: {
          type: 'string',
          example: '{"nodes": [{"id": "1", "type": "class", "data": {"label": "User"}}], "edges": []}',
          description: 'JSON string containing the diagram structure (nodes and edges)'
        },
        projectId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['name should not be empty', 'type must be a valid diagram type'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found - The specified project does not exist.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Project with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  create(@Body() createDiagramDto: CreateDiagramDto) {
    return this.diagramsService.create(createDiagramDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all diagrams or diagrams by project',
    description: 'Retrieves all diagrams from the system, or filters by project ID if provided. Use the projectId query parameter to get diagrams for a specific project.'
  })
  @ApiQuery({
    name: 'projectId',
    required: false,
    type: Number,
    description: 'Optional project ID to filter diagrams by project',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Return all diagrams or diagrams filtered by project.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'User Management Classes' },
          type: { type: 'string', example: 'class', enum: ['class', 'sequence', 'usecase', 'component', 'package'] },
          content: {
            type: 'string',
            example: '{"nodes": [{"id": "1", "type": "class", "data": {"label": "User"}}], "edges": []}',
            description: 'JSON string containing the diagram structure'
          },
          projectId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
          project: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'E-commerce System' },
              description: { type: 'string', example: 'UML diagrams for e-commerce platform' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found - When filtering by projectId and project does not exist.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Project with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  findAll(@Query('projectId') projectId?: number) {
    if (projectId) {
      return this.diagramsService.findByProject(projectId);
    }
    return this.diagramsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a diagram by id',
    description: 'Retrieves a specific diagram by its unique identifier, including its complete content and project information.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the diagram',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Return the diagram.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'User Management Classes' },
        type: { type: 'string', example: 'class', enum: ['class', 'sequence', 'usecase', 'component', 'package'] },
        content: {
          type: 'string',
          example: '{"nodes": [{"id": "1", "type": "class", "data": {"label": "User", "properties": ["- id: UUID", "- username: string"], "methods": ["+ login(): boolean"]}}], "edges": []}',
          description: 'Complete JSON string containing the diagram structure with nodes and edges'
        },
        projectId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        project: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'E-commerce System' },
            description: { type: 'string', example: 'UML diagrams for e-commerce platform' },
            userUUID: { type: 'string', example: 'user-uuid-123' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Diagram not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Diagram with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Validation failed (numeric string is expected)' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.diagramsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a diagram',
    description: 'Updates an existing diagram with new data. Only provided fields will be updated. Content should be a JSON string representing the diagram structure.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the diagram to update',
    example: 1
  })
  @ApiBody({
    description: 'Diagram data to update (partial)',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated Class Diagram' },
        type: { type: 'string', example: 'class', enum: ['class', 'sequence', 'usecase', 'component', 'package'] },
        content: {
          type: 'string',
          example: '{"nodes": [{"id": "1", "type": "class", "data": {"label": "UpdatedUser"}}], "edges": []}',
          description: 'Updated JSON string containing the diagram structure'
        }
      }
    },
    examples: {
      nameUpdate: {
        summary: 'Update diagram name',
        value: {
          name: 'Enhanced User Management Classes'
        }
      },
      contentUpdate: {
        summary: 'Update diagram content',
        value: {
          name: 'User Management Classes',
          content: '{"nodes": [{"id": "1", "type": "class", "data": {"label": "User", "properties": ["- id: UUID", "- username: string", "- email: string"], "methods": ["+ login(): boolean", "+ logout(): void"]}}], "edges": []}'
        }
      },
      typeUpdate: {
        summary: 'Update diagram type',
        value: {
          type: 'sequence'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The diagram has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Updated Class Diagram' },
        type: { type: 'string', example: 'class' },
        content: {
          type: 'string',
          example: '{"nodes": [{"id": "1", "type": "class", "data": {"label": "UpdatedUser"}}], "edges": []}'
        },
        projectId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:45:00.000Z' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Diagram not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Diagram with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid input data.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'array', items: { type: 'string' }, example: ['Invalid JSON format in content'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  update(@Param('id') id: string, @Body() updateDiagramDto: Partial<CreateDiagramDto>) {
    return this.diagramsService.update(+id, updateDiagramDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a diagram',
    description: 'Permanently deletes a diagram from the system. This action cannot be undone. All diagram content and metadata will be lost.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the diagram to delete',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'The diagram has been successfully deleted.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Diagram deleted successfully' },
        deletedDiagram: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'User Management Classes' },
            type: { type: 'string', example: 'class' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Diagram not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Diagram with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid ID format.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Validation failed (numeric string is expected)' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  remove(@Param('id') id: string) {
    return this.diagramsService.remove(+id);
  }
}
