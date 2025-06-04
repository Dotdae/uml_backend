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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('status')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new status',
    description: 'Creates a new project status with the provided name. Status names must be unique.'
  })
  @ApiBody({
    description: 'Status data to create',
    type: CreateStatusDto,
    examples: {
      example1: {
        summary: 'Create Active status',
        value: {
          name: 'Active'
        }
      },
      example2: {
        summary: 'Create Completed status',
        value: {
          name: 'Completed'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The status has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Active' },
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
        message: { type: 'array', items: { type: 'string' }, example: ['name must be a string', 'name should not be empty'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Conflict - Status name already exists.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Status with this name already exists' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  create(@Body() createStatusDto: CreateStatusDto) {
    return this.statusService.create(createStatusDto);
  }

  @Post('seed')
  @ApiOperation({
    summary: 'Seed default statuses',
    description: 'Seeds the database with default project statuses (Active, Archived, etc.). Will not create duplicates if statuses already exist.'
  })
  @ApiResponse({
    status: 201,
    description: 'Default statuses have been seeded.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Active' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'Default statuses already exist.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Active' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  seedDefaultStatuses() {
    return this.statusService.seedDefaultStatuses();
  }

  @Get()
  @ApiOperation({
    summary: 'Get all statuses',
    description: 'Retrieves a list of all available project statuses.'
  })
  @ApiResponse({
    status: 200,
    description: 'Return all statuses.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Active' },
          createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
        }
      }
    }
  })
  findAll() {
    return this.statusService.findAll();
  }

  @Get('with-projects')
  @ApiOperation({
    summary: 'Get all statuses with their associated projects',
    description: 'Retrieves all statuses including their related projects. Useful for getting a complete overview of project distribution across statuses.'
  })
  @ApiResponse({
    status: 200,
    description: 'Return all statuses with their projects.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'Active' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          projects: {
            type: 'array',
            items: {
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
      }
    }
  })
  findAllWithProjects() {
    return this.statusService.findAllWithProjects();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a status by id',
    description: 'Retrieves a specific status by its unique identifier.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the status',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Return the status.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Active' },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Status not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Status with ID 1 not found' },
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
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a status',
    description: 'Updates an existing status with new data. Only provided fields will be updated.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the status to update',
    example: 1
  })
  @ApiBody({
    description: 'Status data to update',
    type: CreateStatusDto,
    examples: {
      example1: {
        summary: 'Update status name',
        value: {
          name: 'In Progress'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The status has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'In Progress' },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:35:00.000Z' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Status not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Status with ID 1 not found' },
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
        message: { type: 'array', items: { type: 'string' }, example: ['name must be a string'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: CreateStatusDto,
  ) {
    return this.statusService.update(id, updateStatusDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a status',
    description: 'Permanently deletes a status. Warning: This action cannot be undone and may affect associated projects.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the status to delete',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'The status has been successfully deleted.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Status deleted successfully' }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Status not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Status with ID 1 not found' },
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
  @ApiResponse({
    status: 409,
    description: 'Conflict - Cannot delete status with associated projects.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Cannot delete status with associated projects' },
        error: { type: 'string', example: 'Conflict' }
      }
    }
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.statusService.remove(id);
  }
}
