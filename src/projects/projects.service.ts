import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { Diagram } from 'src/diagrams/entities/diagram.entity';

@Injectable()
export class ProjectsService {
  private readonly logger = new Logger(ProjectsService.name);

  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  /**
   * @summary Create a new project
   * @description This method is used to create a new project.
   * @param createProjectDto - The DTO containing the project data
   * @returns The created project
   */
  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return await this.projectRepository.save(project);
  }

  /**
   * @summary Get all projects
   * @description This method is used to get all projects.
   * @returns All projects
   */
  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['user', 'diagrams', 'status'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * @summary Get all projects by user
   * @description This method is used to get all projects by user.
   * @param userUUID - The UUID of the user
   * @returns All projects by user
   */
  async findByUser(userUUID: string): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { userUUID },
      relations: ['user', 'diagrams', 'status'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * @summary Get a project by ID
   * @description This method is used to get a project by ID.
   * @param id - The ID of the project
   * @returns The project
   */
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

  /**
   * @summary Update a project
   * @description This method is used to update a project.
   * @param id - The ID of the project
   * @param updateProjectDto - The DTO containing the project data
   * @returns The updated project
   */
  async update(id: number, updateProjectDto: Partial<CreateProjectDto>): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return await this.projectRepository.save(project);
  }

  /**
   * @summary Remove a project
   * @description This method is used to remove a project.
   * @param id - The ID of the project
   */
  async remove(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  /**
   * @summary Duplicate a project
   * @description This method is used to duplicate a project.
   * @param id - The ID of the project
   * @returns The duplicated project
   */
  async duplicate(id: number): Promise<Project> {
    const originalProject = await this.findOne(id);

    const duplicateData: CreateProjectDto = {
      userUUID: originalProject.userUUID,
      projectName: `${originalProject.projectName} (Copy)`,
    };

    return await this.create(duplicateData);
  }

  /**
   * @summary Get all projects by status
   * @description This method is used to get all projects by status.
   * @param statusId - The ID of the status
   * @returns All projects by status
   */
  async findByStatus(statusId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { statusId },
      relations: ['user', 'diagrams', 'status'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * @summary Get all projects by user and status
   * @description This method is used to get all projects by user and status.
   * @param userUUID - The UUID of the user
   * @param statusId - The ID of the status
   * @returns All projects by user and status
   */
  async findByUserAndStatus(userUUID: string, statusId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { userUUID, statusId },
      relations: ['user', 'diagrams', 'status'],
      order: { createdAt: 'DESC' },
    });
  }

  /**
   * @summary Update the status of a project
   * @description This method is used to update the status of a project.
   * @param id - The ID of the project
   * @param statusId - The ID of the status
   * @returns The updated project
   **/
  async updateStatus(id: number, statusId: number): Promise<Project> {
    const project = await this.findOne(id);
    project.statusId = statusId;
    return await this.projectRepository.save(project);
  }



/**
 * @summary Get the diagrams grouped by type
 * @description This method is used to get the diagrams grouped by project and type.
 * @param projectId - The ID of the project
 * @returns The diagrams grouped by type
 */
async getProjectDiagramsGrouped(projectId: number): Promise<{
  classDiagrams: { name: string; info: string }[];
  usecaseDiagrams: { name: string; info: string }[];
  componentDiagrams: { name: string; info: string }[];
  packageDiagrams: { name: string; info: string }[];
  sequenceDiagrams: { name: string; info: string }[];
}> {
  //* Get the project
  const project = await this.projectRepository.findOne({
    where: { id: projectId },
    relations: ['diagrams'],
  });

  //* Check if the project exists
  if (!project) {
    throw new NotFoundException(`Project with ID ${projectId} not found`);
  }

  //* Group the diagrams by type
  const grouped = {
    classDiagrams: [] as { name: string; info: string }[],
    usecaseDiagrams: [] as { name: string; info: string }[],
    componentDiagrams: [] as { name: string; info: string }[],
    packageDiagrams: [] as { name: string; info: string }[],
    sequenceDiagrams: [] as { name: string; info: string }[],
  };

  //* Group the diagrams by type
  for (const diagram of project.diagrams) {
    const diagramData = {
      name: diagram.name,
      info: JSON.stringify(diagram.infoJson),
    };

    //* Add the diagram to the correct group
    switch (diagram.type) {
      case 1: grouped.classDiagrams.push(diagramData); break;
      case 2: grouped.usecaseDiagrams.push(diagramData); break;
      case 3: grouped.sequenceDiagrams.push(diagramData); break;
      case 4: grouped.packageDiagrams.push(diagramData); break;
      case 5: grouped.componentDiagrams.push(diagramData); break;
      default: break;
    }
  }

  //* Return the grouped diagrams
  return grouped;
}

  /**
   * @summary Get the count of projects
   * @description This method is used to get the count of projects.
   * @param userUUID - The UUID of the user
   * @returns The count of projects
   */
  async getProjectCount(userUUID: string): Promise<number> {
    this.logger.log(`Getting project count for user ${userUUID}`);
    return await this.projectRepository.count({ where: { userUUID } });
  }
}
