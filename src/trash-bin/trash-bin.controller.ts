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

@Controller('trash-bin')
@UseGuards(AuthGuard())
export class TrashBinController {
  constructor(private readonly trashBinService: TrashBinService) {}

  @Post()
  create(@Body() createTrashBinDto: CreateTrashBinDto, @GetUser() user: User) {
    // Ensure the trash item is created for the authenticated user
    createTrashBinDto.deletedBy = user.id;
    return this.trashBinService.create(createTrashBinDto);
  }

  @Get()
  findAll(@GetUser() user: User) {
    // Only return trash items for the authenticated user
    return this.trashBinService.findByUser(user.id);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string, @GetUser() user: User) {
    // Ensure users can only access their own trash items
    if (userId !== user.id) {
      throw new ForbiddenException('You can only access your own trash items');
    }
    return this.trashBinService.findByUser(userId);
  }

  @Get('project/:projectId')
  async findByProject(@Param('projectId', ParseIntPipe) projectId: number, @GetUser() user: User) {
    // This method should also verify that the project belongs to the user
    // For now, let's filter by user as well
    const userTrashItems = await this.trashBinService.findByUser(user.id);
    return userTrashItems.filter(item => item.projectId === projectId);
  }

  @Get('diagram/:diagramId')
  async findByDiagram(@Param('diagramId', ParseIntPipe) diagramId: number, @GetUser() user: User) {
    // This method should also verify that the diagram belongs to the user
    // For now, let's filter by user as well
    const userTrashItems = await this.trashBinService.findByUser(user.id);
    return userTrashItems.filter(item => item.diagramId === diagramId);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const trashItem = await this.trashBinService.findOne(id);

    // Ensure user can only access their own trash items
    if (trashItem.deletedBy !== user.id) {
      throw new ForbiddenException('You can only access your own trash items');
    }

    return trashItem;
  }

  @Patch(':id')
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
  async restore(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const trashItem = await this.trashBinService.findOne(id);

    // Ensure user can only restore their own trash items
    if (trashItem.deletedBy !== user.id) {
      throw new ForbiddenException('You can only restore your own trash items');
    }

    return this.trashBinService.restore(id);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const trashItem = await this.trashBinService.findOne(id);

    // Ensure user can only delete their own trash items
    if (trashItem.deletedBy !== user.id) {
      throw new ForbiddenException('You can only delete your own trash items');
    }

    return this.trashBinService.remove(id);
  }

  @Delete('empty/all')
  emptyAllTrash(@GetUser() user: User) {
    // Only empty trash for the authenticated user
    return this.trashBinService.emptyTrash(user.id);
  }

  @Delete('empty/user/:userId')
  emptyUserTrash(@Param('userId') userId: string, @GetUser() user: User) {
    // Ensure users can only empty their own trash
    if (userId !== user.id) {
      throw new ForbiddenException('You can only empty your own trash');
    }
    return this.trashBinService.emptyTrash(userId);
  }
}
