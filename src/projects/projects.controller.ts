import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards, ForbiddenException } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('projects')
@Controller('projects')
@UseGuards(AuthGuard())
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new project' })
  @ApiResponse({ status: 201, description: 'The project has been successfully created.' })
  create(@Body() createProjectDto: CreateProjectDto, @GetUser() user: User) {
    // Ensure the project is created for the authenticated user
    createProjectDto.userUUID = user.id;
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get projects for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Return projects for the authenticated user.' })
  findAll(@GetUser() user: User) {
    // Always return projects for the authenticated user only
    return this.projectsService.findByUser(user.id);
  }

  @Get('user/:userUUID')
  @ApiOperation({ summary: 'Get projects by user UUID (only accessible by the same user)' })
  @ApiResponse({ status: 200, description: 'Return projects for the specified user.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot access other user\'s projects.' })
  findByUser(@Param('userUUID') userUUID: string, @GetUser() user: User) {
    // Ensure users can only access their own projects
    if (userUUID !== user.id) {
      throw new ForbiddenException('You can only access your own projects');
    }
    return this.projectsService.findByUser(userUUID);
  }

  @Get('status/:statusId')
  @ApiOperation({ summary: 'Get projects by status for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Return user\'s projects with the specified status.' })
  findByStatus(@Param('statusId', ParseIntPipe) statusId: number, @GetUser() user: User) {
    // Only return projects for the authenticated user with the specified status
    return this.projectsService.findByUserAndStatus(user.id, statusId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a project by id (only if owned by authenticated user)' })
  @ApiResponse({ status: 200, description: 'Return the project.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot access other user\'s project.' })
  async findOne(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const project = await this.projectsService.findOne(id);

    // Ensure user can only access their own projects
    if (project.userUUID !== user.id) {
      throw new ForbiddenException('You can only access your own projects');
    }

    return project;
  }

  @Post(':id/duplicate')
  @ApiOperation({ summary: 'Duplicate a project (only if owned by authenticated user)' })
  @ApiResponse({ status: 201, description: 'The project has been successfully duplicated.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot duplicate other user\'s project.' })
  async duplicate(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const project = await this.projectsService.findOne(id);

    // Ensure user can only duplicate their own projects
    if (project.userUUID !== user.id) {
      throw new ForbiddenException('You can only duplicate your own projects');
    }

    return this.projectsService.duplicate(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a project (only if owned by authenticated user)' })
  @ApiResponse({ status: 200, description: 'The project has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot update other user\'s project.' })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateProjectDto: Partial<CreateProjectDto>, @GetUser() user: User) {
    const project = await this.projectsService.findOne(id);

    // Ensure user can only update their own projects
    if (project.userUUID !== user.id) {
      throw new ForbiddenException('You can only update your own projects');
    }

    return this.projectsService.update(id, updateProjectDto);
  }

  @Patch(':id/status/:statusId')
  @ApiOperation({ summary: 'Update project status (only if owned by authenticated user)' })
  @ApiResponse({ status: 200, description: 'The project status has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot update other user\'s project status.' })
  async updateStatus(@Param('id', ParseIntPipe) id: number, @Param('statusId', ParseIntPipe) statusId: number, @GetUser() user: User) {
    const project = await this.projectsService.findOne(id);

    // Ensure user can only update their own projects
    if (project.userUUID !== user.id) {
      throw new ForbiddenException('You can only update your own projects');
    }

    return this.projectsService.updateStatus(id, statusId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a project (only if owned by authenticated user)' })
  @ApiResponse({ status: 200, description: 'The project has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Project not found.' })
  @ApiResponse({ status: 403, description: 'Forbidden: Cannot delete other user\'s project.' })
  async remove(@Param('id', ParseIntPipe) id: number, @GetUser() user: User) {
    const project = await this.projectsService.findOne(id);

    // Ensure user can only delete their own projects
    if (project.userUUID !== user.id) {
      throw new ForbiddenException('You can only delete your own projects');
    }

    return this.projectsService.remove(id);
  }
}
