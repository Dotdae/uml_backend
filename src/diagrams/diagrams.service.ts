import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagram } from './entities/diagram.entity';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import { DiagramTypeService } from './diagram-type.service';
import { getDiagramTypeString } from './utils/diagram-type.utils';
import { DiagramResponse } from './interfaces/diagram.interface';

@Injectable()
export class DiagramsService {
  private readonly logger = new Logger(DiagramsService.name);

  constructor(
    @InjectRepository(Diagram)
    private diagramRepository: Repository<Diagram>,
    private diagramTypeService: DiagramTypeService,
  ) {}

  async create(createDiagramDto: CreateDiagramDto): Promise<Diagram> {
    // Verify that the diagram type exists
    await this.diagramTypeService.findOne(createDiagramDto.type);

    const diagram = this.diagramRepository.create(createDiagramDto);
    return await this.diagramRepository.save(diagram);
  }

  async findAll(): Promise<Diagram[]> {
    return await this.diagramRepository.find({
      relations: ['project', 'diagramType'],
    });
  }

  async findOne(id: number): Promise<DiagramResponse> {
    const diagram = await this.diagramRepository.findOne({
      where: { id },
      relations: ['project', 'diagramType'],
    });
    if (!diagram) {
      throw new NotFoundException(`Diagram with ID ${id} not found`);
    }

    // Convert type ID to string
    return {
      ...diagram,
      typeString: getDiagramTypeString(diagram.type)
    };
  }

  async findByProject(projectId: number): Promise<DiagramResponse[]> {
    const diagrams = await this.diagramRepository.find({
      where: { idProject: projectId },
      relations: ['project', 'diagramType'],
    });

    // Convert type IDs to strings for each diagram
    return diagrams.map(diagram => ({
      ...diagram,
      typeString: getDiagramTypeString(diagram.type)
    }));
  }

  async update(id: number, updateDiagramDto: Partial<CreateDiagramDto>): Promise<Diagram> {
    const diagram = await this.findOne(id);

    // If updating the type, verify it exists
    if (updateDiagramDto.type) {
      await this.diagramTypeService.findOne(updateDiagramDto.type);
    }

    // Increment version number
    diagram.version += 1;

    Object.assign(diagram, updateDiagramDto);
    return await this.diagramRepository.save(diagram);
  }

  async remove(id: number): Promise<void> {
    const result = await this.diagramRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Diagram with ID ${id} not found`);
    }
  }

  async getDiagramCount(userUUID: string): Promise<{ count: number }> {
    this.logger.debug(`Getting diagram count for user ${userUUID}`);

    try {
      const query = this.diagramRepository
        .createQueryBuilder('diagram')
        .innerJoin('projects', 'project', 'diagram.id_project = project.id')
        .where('project.user_uuid = :userUUID', { userUUID });

      this.logger.debug(`Executing query: ${query.getQuery()}`);

      const count = await query.getCount();
      this.logger.debug(`Found ${count} diagrams for user ${userUUID}`);

      return { count };
    } catch (error) {
      this.logger.error(`Error getting diagram count: ${error.message}`, error.stack);
      throw error;
    }
  }
}
