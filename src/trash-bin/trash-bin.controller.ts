import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { TrashBinService } from './trash-bin.service';
import { CreateTrashBinDto } from './dto/create-trash-bin.dto';
import { UpdateTrashBinDto } from './dto/update-trash-bin.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('trash-bin')
@ApiBearerAuth('JWT-auth')
@Controller('trash-bin')
@UseGuards(AuthGuard())
export class TrashBinController {
  constructor(private readonly trashBinService: TrashBinService) {}

  @Post()
  @ApiOperation({
    summary: 'Add item to trash bin',
    description: 'Moves a project or diagram to the trash bin. The item will be marked as deleted but not permanently removed from the database.'
  })
  @ApiBody({
    description: 'Trash bin item data',
    type: CreateTrashBinDto,
    examples: {
      projectExample: {
        summary: 'Move project to trash',
        value: {
          projectId: 1,
          itemType: 'project',
          itemName: 'E-commerce System'
        }
      },
      diagramExample: {
        summary: 'Move diagram to trash',
        value: {
          diagramId: 5,
          projectId: 1,
          itemType: 'diagram',
          itemName: 'User Authentication Flow'
        }
      }
    }
  })
  @ApiResponse({
    status: 201,
    description: 'The item has been successfully added to trash.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        projectId: { type: 'number', example: 1, nullable: true },
        diagramId: { type: 'number', example: 5, nullable: true },
        itemType: { type: 'string', example: 'project', enum: ['project', 'diagram'] },
        itemName: { type: 'string', example: 'E-commerce System' },
        deletedBy: { type: 'string', example: 'user-uuid-123' },
        deletedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
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
        message: { type: 'array', items: { type: 'string' }, example: ['itemType must be either project or diagram'] },
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
  create(@Body() createTrashBinDto: CreateTrashBinDto, @GetUser() user: User) {
    // Ensure the trash item is created for the authenticated user
    createTrashBinDto.deletedBy = user.id;
    return this.trashBinService.create(createTrashBinDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all trash items for authenticated user',
    description: 'Retrieves all items in the trash bin for the currently authenticated user.'
  })
  @ApiResponse({
    status: 200,
    description: 'Return all trash items for the authenticated user.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          projectId: { type: 'number', example: 1, nullable: true },
          diagramId: { type: 'number', example: 5, nullable: true },
          itemType: { type: 'string', example: 'project', enum: ['project', 'diagram'] },
          itemName: { type: 'string', example: 'E-commerce System' },
          deletedBy: { type: 'string', example: 'user-uuid-123' },
          deletedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
          createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
          updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' }
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing authentication token.'
  })
  findAll(@GetUser() user: User) {
    // Only return trash items for the authenticated user
    return this.trashBinService.findByUser(user.id);
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get trash items by user (only accessible by the same user)',
    description: 'Retrieves trash items for a specific user. Users can only access their own trash items.'
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'The UUID of the user whose trash items to retrieve',
    example: 'user-uuid-123'
  })
  @ApiResponse({
    status: 200,
    description: 'Return trash items for the specified user.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          projectId: { type: 'number', example: 1, nullable: true },
          diagramId: { type: 'number', example: 5, nullable: true },
          itemType: { type: 'string', example: 'project' },
          itemName: { type: 'string', example: 'E-commerce System' },
          deletedBy: { type: 'string', example: 'user-uuid-123' },
          deletedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Cannot access other user\'s trash items.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only access your own trash items' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  findByUser(@Param('userId') userId: string, @GetUser() user: User) {
    // Ensure users can only access their own trash items
    if (userId !== user.id) {
      throw new ForbiddenException('You can only access your own trash items');
    }
    return this.trashBinService.findByUser(userId);
  }

  @Get('project/:projectId')
  @ApiOperation({
    summary: 'Get trash items by project for authenticated user',
    description: 'Retrieves all trash items related to a specific project for the authenticated user.'
  })
  @ApiParam({
    name: 'projectId',
    type: 'number',
    description: 'The unique identifier of the project',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Return trash items for the specified project.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          projectId: { type: 'number', example: 1 },
          diagramId: { type: 'number', example: 5, nullable: true },
          itemType: { type: 'string', example: 'diagram' },
          itemName: { type: 'string', example: 'User Authentication Flow' },
          deletedBy: { type: 'string', example: 'user-uuid-123' },
          deletedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async findByProject(@Param('projectId', ParseIntPipe) projectId: number, @GetUser() user: User) {
    // This method should also verify that the project belongs to the user
    // For now, let's filter by user as well
    const userTrashItems = await this.trashBinService.findByUser(user.id);
    return userTrashItems.filter(item => item.projectId === projectId);
  }

  @Get('diagram/:diagramId')
  @ApiOperation({
    summary: 'Get trash items by diagram for authenticated user',
    description: 'Retrieves all trash items related to a specific diagram for the authenticated user.'
  })
  @ApiParam({
    name: 'diagramId',
    type: 'number',
    description: 'The unique identifier of the diagram',
    example: 5
  })
  @ApiResponse({
    status: 200,
    description: 'Return trash items for the specified diagram.',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          projectId: { type: 'number', example: 1 },
          diagramId: { type: 'number', example: 5 },
          itemType: { type: 'string', example: 'diagram' },
          itemName: { type: 'string', example: 'User Authentication Flow' },
          deletedBy: { type: 'string', example: 'user-uuid-123' },
          deletedAt: { type: 'string', format: 'date-time' }
        }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async findByDiagram(@Param('diagramId', ParseIntPipe) diagramId: number, @GetUser() user: User) {
    // This method should also verify that the diagram belongs to the user
    // For now, let's filter by user as well
    const userTrashItems = await this.trashBinService.findByUser(user.id);
    return userTrashItems.filter(item => item.diagramId === diagramId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a trash item by id (only if owned by authenticated user)',
    description: 'Retrieves a specific trash item by its unique identifier. Users can only access their own trash items.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the trash item',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Return the trash item.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        projectId: { type: 'number', example: 1, nullable: true },
        diagramId: { type: 'number', example: 5, nullable: true },
        itemType: { type: 'string', example: 'project' },
        itemName: { type: 'string', example: 'E-commerce System' },
        deletedBy: { type: 'string', example: 'user-uuid-123' },
        deletedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00.000Z' },
        project: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'E-commerce System' },
            description: { type: 'string', example: 'UML diagrams for e-commerce platform' }
          }
        },
        diagram: {
          type: 'object',
          nullable: true,
          properties: {
            id: { type: 'number', example: 5 },
            name: { type: 'string', example: 'User Authentication Flow' },
            type: { type: 'string', example: 'sequence' }
          }
        }
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Trash item not found.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Trash item with ID 1 not found' },
        error: { type: 'string', example: 'Not Found' }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Cannot access other user\'s trash item.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only access your own trash items' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const trashItem = await this.trashBinService.findOne(id);

    // Ensure user can only access their own trash items
    if (trashItem.deletedBy !== user.id) {
      throw new ForbiddenException('You can only access your own trash items');
    }

    return trashItem;
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a trash item (only if owned by authenticated user)',
    description: 'Updates a trash item with new data. Users can only update their own trash items.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the trash item to update',
    example: 1
  })
  @ApiBody({
    description: 'Updated trash item data',
    type: UpdateTrashBinDto,
    examples: {
      example1: {
        summary: 'Update item name',
        value: {
          itemName: 'Updated Project Name'
        }
      }
    }
  })
  @ApiResponse({
    status: 200,
    description: 'The trash item has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        itemName: { type: 'string', example: 'Updated Project Name' },
        updatedAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:35:00.000Z' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Trash item not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot update other user\'s trash item.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTrashBinDto: UpdateTrashBinDto,
    @GetUser() user: User
  ) {
    const trashItem = await this.trashBinService.findOne(id);

    // Ensure user can only update their own trash items
    if (trashItem.deletedBy !== user.id) {
      throw new ForbiddenException('You can only update your own trash items');
    }

    return this.trashBinService.update(id, updateTrashBinDto);
  }

  @Post(':id/restore')
  @ApiOperation({
    summary: 'Restore item from trash (only if owned by authenticated user)',
    description: 'Restores an item from the trash bin back to its original location. The trash entry will be removed and the item will be active again.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the trash item to restore',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully restored from trash.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Item restored successfully' },
        restoredItem: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            type: { type: 'string', example: 'project' },
            name: { type: 'string', example: 'E-commerce System' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Trash item not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot restore other user\'s trash item.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async restore(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const trashItem = await this.trashBinService.findOne(id);

    // Ensure user can only restore their own trash items
    if (trashItem.deletedBy !== user.id) {
      throw new ForbiddenException('You can only restore your own trash items');
    }

    return this.trashBinService.restore(id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Permanently delete item from trash (only if owned by authenticated user)',
    description: 'Permanently deletes an item from the trash bin. This action cannot be undone.'
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'The unique identifier of the trash item to permanently delete',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'The item has been permanently deleted.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Item permanently deleted' }
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Trash item not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot delete other user\'s trash item.' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const trashItem = await this.trashBinService.findOne(id);

    // Ensure user can only delete their own trash items
    if (trashItem.deletedBy !== user.id) {
      throw new ForbiddenException('You can only delete your own trash items');
    }

    return this.trashBinService.remove(id);
  }

  @Delete('empty/all')
  @ApiOperation({
    summary: 'Empty all trash for authenticated user',
    description: 'Permanently deletes all items in the trash bin for the authenticated user. This action cannot be undone.'
  })
  @ApiResponse({
    status: 200,
    description: 'All trash items have been permanently deleted.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'All trash items permanently deleted' },
        deletedCount: { type: 'number', example: 5 }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  emptyAllTrash(@GetUser() user: User) {
    // Only empty trash for the authenticated user
    return this.trashBinService.emptyTrash(user.id);
  }

  @Delete('empty/user/:userId')
  @ApiOperation({
    summary: 'Empty trash for specific user (only accessible by the same user)',
    description: 'Permanently deletes all trash items for a specific user. Users can only empty their own trash.'
  })
  @ApiParam({
    name: 'userId',
    type: 'string',
    description: 'The UUID of the user whose trash to empty',
    example: 'user-uuid-123'
  })
  @ApiResponse({
    status: 200,
    description: 'User\'s trash has been emptied.',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'User trash emptied successfully' },
        deletedCount: { type: 'number', example: 3 }
      }
    }
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden: Cannot empty other user\'s trash.',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: { type: 'string', example: 'You can only empty your own trash' },
        error: { type: 'string', example: 'Forbidden' }
      }
    }
  })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid or missing authentication token.' })
  emptyUserTrash(@Param('userId') userId: string, @GetUser() user: User) {
    // Ensure users can only empty their own trash
    if (userId !== user.id) {
      throw new ForbiddenException('You can only empty your own trash');
    }
    return this.trashBinService.emptyTrash(userId);
  }
}
