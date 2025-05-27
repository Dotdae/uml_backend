import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagramType } from './entities/diagram-type.entity';
import { CreateDiagramTypeDto } from './dto/create-diagram-type.dto';

@Injectable()
export class DiagramTypeService {
  constructor(
    @InjectRepository(DiagramType)
    private diagramTypeRepository: Repository<DiagramType>,
  ) {}

  async create(createDiagramTypeDto: CreateDiagramTypeDto): Promise<DiagramType> {
    const diagramType = this.diagramTypeRepository.create(createDiagramTypeDto);
    return await this.diagramTypeRepository.save(diagramType);
  }

  async findAll(): Promise<DiagramType[]> {
    return await this.diagramTypeRepository.find();
  }

  async findOne(id: number): Promise<DiagramType> {
    const diagramType = await this.diagramTypeRepository.findOne({ where: { id } });
    if (!diagramType) {
      throw new NotFoundException(`Diagram type with ID ${id} not found`);
    }
    return diagramType;
  }

  async update(id: number, updateDiagramTypeDto: Partial<CreateDiagramTypeDto>): Promise<DiagramType> {
    const diagramType = await this.findOne(id);
    Object.assign(diagramType, updateDiagramTypeDto);
    return await this.diagramTypeRepository.save(diagramType);
  }

  async remove(id: number): Promise<void> {
    const result = await this.diagramTypeRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Diagram type with ID ${id} not found`);
    }
  }
} 