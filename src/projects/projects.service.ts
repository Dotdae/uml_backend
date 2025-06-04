import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Diagram } from 'src/diagrams/entities/diagram.entity';

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



async getProjectDiagramsGrouped(projectId: number): Promise<{
  classDiagrams: { name: string; info: string }[];
  usecaseDiagrams: { name: string; info: string }[];
  componentDiagrams: { name: string; info: string }[];
  packageDiagrams: { name: string; info: string }[];
  sequenceDiagrams: { name: string; info: string }[];
}> {
  const project = await this.projectRepository.findOne({
    where: { id: projectId },
    relations: ['diagrams'],
  });

  if (!project) {
    throw new NotFoundException(`Project with ID ${projectId} not found`);
  }

  const grouped = {
    classDiagrams: [] as { name: string; info: string }[],
    usecaseDiagrams: [] as { name: string; info: string }[],
    componentDiagrams: [] as { name: string; info: string }[],
    packageDiagrams: [] as { name: string; info: string }[],
    sequenceDiagrams: [] as { name: string; info: string }[],
  };

  for (const diagram of project.diagrams) {
    const diagramData = {
      name: diagram.name,
      info: JSON.stringify(diagram.infoJson),
    };

    switch (diagram.type) {
      case 1: grouped.classDiagrams.push(diagramData); break;
      case 2: grouped.usecaseDiagrams.push(diagramData); break;
      case 3: grouped.sequenceDiagrams.push(diagramData); break;
      case 4: grouped.packageDiagrams.push(diagramData); break;
      case 5: grouped.componentDiagrams.push(diagramData); break;
      default: break;
    }
  }

  return grouped;
}

}
