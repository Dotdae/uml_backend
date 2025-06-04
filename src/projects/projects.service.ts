import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['user', 'diagrams', 'status'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUser(userUUID: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { userUUID },
      relations: ['user', 'diagrams', 'status'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['user', 'diagrams', 'status'],
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    return project;
  }

  async update(id: number, updateProjectDto: Partial<CreateProjectDto>): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async duplicate(id: number): Promise<Project> {
    const originalProject = await this.findOne(id);

    const duplicateData: CreateProjectDto = {
      userUUID: originalProject.userUUID,
      projectName: `${originalProject.projectName} (Copy)`,
    };

    return await this.create(duplicateData);
  }

  async findByStatus(statusId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { statusId },
      relations: ['user', 'diagrams', 'status'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserAndStatus(userUUID: string, statusId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { userUUID, statusId },
      relations: ['user', 'diagrams', 'status'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: number, statusId: number): Promise<Project> {
    const project = await this.findOne(id);
    project.statusId = statusId;
    return await this.projectRepository.save(project);
  }
}
