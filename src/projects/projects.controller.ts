import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, ForbiddenException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('projects')
@ApiBearerAuth('JWT-auth')
@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new project',
    description: 'Creates a new UML project for the authenticated user. The project will be automatically assigned to the user making the request.'
  })
  @ApiBody({
    description: 'Project data to create',
    type: CreateProjectDto,
    examples: {
      example1: {
        summary: 'E-commerce project',
        value: {
          name: 'E-commerce System',
          description: 'UML diagrams for online shopping platform with user management, product catalog, and order processing',
          statusId: 1
        }
      },
      example2: {
        summary: 'Banking system',
        value: {
          name: 'Banking Management System',
          description: 'Complete UML documentation for banking operations including accounts, transactions, and customer management',
          statusId: 1
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'E-commerce System' },
        description: { type: 'string', example: 'UML diagrams for online shopping platform' },
        userUUID: { type: 'string', example: 'user-uuid-123' },
        statusId: { type: 'number', example: 1 },
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
        message: { type: 'array', items: { type: 'string' }, example: ['name should not be empty', 'name must be a string'] },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Unauthorized' }
      }
    }
  })
  create(@Body() createProjectDto: CreateProjectDto, @GetUser() user: User) {
    // Ensure the project is created for the authenticated user
    createProjectDto.userUUID = user.id;
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get projects for the authenticated user',
    description: 'Retrieves all projects belonging to the currently authenticated user.'
  })
  @ApiResponse({
    status: 200,
    description: 'Return projects for the authenticated user.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'E-commerce System' },
          description: { type: 'string', example: 'UML diagrams for online shopping platform' },
          userUUID: { type: 'string', example: 'user-uuid-123' },
          statusId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
          status: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Active' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  findAll(@GetUser() user: User) {
    // Always return projects for the authenticated user only
    return this.projectsService.findByUser(user.id);
  }

  @Get('user/:userUUID')
  @ApiOperation({
    summary: 'Get projects by user UUID (only accessible by the same user)',
    description: 'Retrieves projects for a specific user UUID. Users can only access their own projects for security reasons.'
  })
  @ApiParam({
    name: 'userUUID',
    type: 'string',
    description: 'The UUID of the user whose projects to retrieve',
    example: 'user-uuid-123'
  })
  @ApiResponse({
    status: 200,
    description: 'Return projects for the specified user.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'E-commerce System' },
          description: { type: 'string', example: 'UML diagrams for online shopping platform' },
          userUUID: { type: 'string', example: 'user-uuid-123' },
          statusId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Cannot access other user\'s projects.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only access your own projects' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  findByUser(@Param('userUUID') userUUID: string, @GetUser() user: User) {
    // Ensure users can only access their own projects
    if (userUUID !== user.id) {
      throw new ForbiddenException('You can only access your own projects');
    }
    return this.projectsService.findByUser(userUUID);
  }

  @Get('status/:statusId')
  @ApiOperation({
    summary: 'Get projects by status for the authenticated user',
    description: 'Retrieves all projects belonging to the authenticated user that have a specific status (e.g., Active, Archived, In Trash).'
  })
  @ApiParam({
    name: 'statusId',
    type: 'number',
    description: 'The unique identifier of the status to filter by',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Return user\'s projects with the specified status.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'E-commerce System' },
          description: { type: 'string', example: 'UML diagrams for online shopping platform' },
          userUUID: { type: 'string', example: 'user-uuid-123' },
          statusId: { type: 'number', example: 1 },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          status: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'Active' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid status ID format.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Validation failed (numeric string is expected)' },
        error: { type: 'string', example: 'Bad Request' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  findByStatus(@Param('statusId', ParseIntPipe) statusId: number, @GetUser() user: User) {
    // Only return projects for the authenticated user with the specified status
    return this.projectsService.findByUserAndStatus(user.id, statusId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a project by id (only if owned by authenticated user)',
    description: 'Retrieves a specific project by its unique identifier. Users can only access projects they own.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the project',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Return the project.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'E-commerce System' },
        description: { type: 'string', example: 'UML diagrams for online shopping platform with user management, product catalog, and order processing' },
        userUUID: { type: 'string', example: 'user-uuid-123' },
        statusId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        status: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'Active' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        diagrams: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'User Class Diagram' },
              type: { type: 'string', example: 'class' },
              content: { type: 'string', example: '{"nodes": [], "edges": []}' }
            }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Project not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Project with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Cannot access other user\'s project.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only access your own projects' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const project = await this.projectsService.findOne(id);

    // Ensure user can only access their own projects
    if (project.userUUID !== user.id) {
      throw new ForbiddenException('You can only access your own projects');
    }

    return project;
  }

  @Post(':id/duplicate')
  @ApiOperation({
    summary: 'Duplicate a project (only if owned by authenticated user)',
    description: 'Creates a copy of an existing project including all its diagrams. The duplicated project will have a new ID and timestamps but same content.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the project to duplicate',
    example: 1
  })
  @ApiResponse({
    status: 201,
    description: 'The project has been successfully duplicated.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 2 },
        name: { type: 'string', example: 'E-commerce System (Copy)' },
        description: { type: 'string', example: 'UML diagrams for online shopping platform (Duplicated)' },
        userUUID: { type: 'string', example: 'user-uuid-123' },
        statusId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T11:00:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T11:00:00.000Z' },
        originalProjectId: { type: 'number', example: 1 }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot duplicate other user\'s project.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async duplicate(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const project = await this.projectsService.findOne(id);

    // Ensure user can only duplicate their own projects
    if (project.userUUID !== user.id) {
      throw new ForbiddenException('You can only duplicate your own projects');
    }

    return this.projectsService.duplicate(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a project (only if owned by authenticated user)',
    description: 'Updates an existing project with new data. Only provided fields will be updated. Users can only update their own projects.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the project to update',
    example: 1
  })
  @ApiBody({
    description: 'Project data to update (partial)',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Updated E-commerce System' },
        description: { type: 'string', example: 'Updated description for the e-commerce platform' },
        statusId: { type: 'number', example: 2 }
      }
    },
    examples: {
      nameUpdate: {
        summary: 'Update project name',
        value: {
          name: 'Advanced E-commerce System'
        }
      },
      fullUpdate: {
        summary: 'Update multiple fields',
        value: {
          name: 'Enterprise E-commerce Platform',
          description: 'Complete UML documentation for enterprise-level e-commerce solution with microservices architecture',
          statusId: 1
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'Updated E-commerce System' },
        description: { type: 'string', example: 'Updated description for the e-commerce platform' },
        userUUID: { type: 'string', example: 'user-uuid-123' },
        statusId: { type: 'number', example: 1 },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:45:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot update other user\'s project.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: Partial<CreateProjectDto>, @GetUser() user: User) {
    const project = await this.projectsService.findOne(id);

    // Ensure user can only update their own projects
    if (project.userUUID !== user.id) {
      throw new ForbiddenException('You can only update your own projects');
    }

    return this.projectsService.update(id, updateProjectDto);
  }

  @Patch(':id/status/:statusId')
  @ApiOperation({
    summary: 'Update project status (only if owned by authenticated user)',
    description: 'Updates the status of a project (e.g., Active to Archived, Active to Trash). Users can only update their own projects.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the project',
    example: 1
  })
  @ApiParam({
    name: 'statusId',
    type: 'number',
    description: 'The new status ID to assign to the project',
    example: 2
  })
  @ApiResponse({
    status: 200,
    description: 'The project status has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'E-commerce System' },
        description: { type: 'string', example: 'UML diagrams for online shopping platform' },
        userUUID: { type: 'string', example: 'user-uuid-123' },
        statusId: { type: 'number', example: 2 },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:45:00.000Z' },
        status: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 2 },
            name: { type: 'string', example: 'Archived' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot update other user\'s project status.' })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid status ID.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Param('statusId', ParseIntPipe) statusId: number, @GetUser() user: User) {
    const project = await this.projectsService.findOne(id);

    // Ensure user can only update their own projects
    if (project.userUUID !== user.id) {
      throw new ForbiddenException('You can only update your own projects');
    }

    return this.projectsService.updateStatus(id, statusId);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a project (only if owned by authenticated user)',
    description: 'Moves a project to trash or permanently deletes it depending on current status. Users can only delete their own projects.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the project to delete',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'The project has been successfully deleted.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Project deleted successfully' },
        deletedProject: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'E-commerce System' },
            statusId: { type: 'number', example: 2 }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot delete other user\'s project.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const project = await this.projectsService.findOne(id);

    // Ensure user can only delete their own projects
    if (project.userUUID !== user.id) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    return this.projectsService.remove(id);
  }
}
