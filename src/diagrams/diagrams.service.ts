import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Diagram } from './entities/diagram.entity';
import { CreateDiagramDto } from './dto/create-diagram.dto';
import { DiagramTypeService } from './diagram-type.service';

@Injectable()
export class DiagramsService {
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

  async findOne(id: number): Promise<Diagram> {
    const diagram = await this.diagramRepository.findOne({
      where: { id },
      relations: ['project', 'diagramType'],
    });
    if (!diagram) {
      throw new NotFoundException(`Diagram with ID ${id} not found`);
    }
    return diagram;
  }

  async findByProject(projectId: number): Promise<Diagram[]> {
    return await this.diagramRepository.find({
      where: { idProject: projectId },
      relations: ['project', 'diagramType'],
    });
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
}
