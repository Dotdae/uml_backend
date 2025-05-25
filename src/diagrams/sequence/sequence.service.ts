import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSequenceDto } from './dto/create-sequence.dto';
import { UpdateSequenceDto } from './dto/update-sequence.dto';
import { Sequence } from './entities/sequence.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyect } from 'src/proyects/entities/proyect.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SequenceService {
  constructor(
    @InjectRepository(Sequence)
    private readonly sequenceRepository: Repository<Sequence>,
    @InjectRepository(Proyect)
    private readonly projectRepository: Repository<Proyect>,
  ) { }

  async create(createSequenceDto: CreateSequenceDto): Promise<Sequence> {
    const { info, projectId } = createSequenceDto;

    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new NotFoundException(`El proyecto con ID ${projectId} no existe`);
    }

    const newSequence = this.sequenceRepository.create({ info, project });
    return await this.sequenceRepository.save(newSequence);
  }

  async findAll(): Promise<Sequence[]> {
    return this.sequenceRepository.find({ relations: ['project'] });
  }

  async findOne(id: number): Promise<Sequence> {
    const sequence = await this.sequenceRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!sequence) {
      throw new NotFoundException(`La secuencia con ID ${id} no existe`);
    }
    return sequence;
  }

  async update(
    id: number,
    updateSequenceDto: UpdateSequenceDto,
  ): Promise<Sequence> {
    await this.sequenceRepository.update(id, updateSequenceDto);
    const updatedSequence = await this.sequenceRepository.findOne({
      where: { id },
    });
    if (!updatedSequence) {
      throw new NotFoundException(`La secuencia con ID ${id} no existe`);
    }
    return updatedSequence;
  }

  async remove(id: number): Promise<void> {
    const sequence = await this.findOne(id);
    await this.sequenceRepository.remove(sequence);
  }
}
