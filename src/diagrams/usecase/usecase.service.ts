import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsecaseDto } from './dto/create-usecase.dto';
import { UpdateUsecaseDto } from './dto/update-usecase.dto';
import { Usecase } from './entities/usecase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyect } from 'src/proyects/entities/proyect.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsecaseService {
  constructor(
    @InjectRepository(Usecase)
    private readonly usecaseRepository: Repository<Usecase>,
    @InjectRepository(Proyect)
    private readonly projectRepository: Repository<Proyect>,
  ) {}

  async create(createUsecaseDto: CreateUsecaseDto): Promise<Usecase> {
    const { info, projectId } = createUsecaseDto;

    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`El proyecto con ID ${projectId} no existe`);
    }

    const newUsecase = this.usecaseRepository.create({ info, project });
    return await this.usecaseRepository.save(newUsecase);
  }

  async findAll(): Promise<Usecase[]> {
    return this.usecaseRepository.find({ relations: ['project'] });
  }

  async findOne(id: number): Promise<Usecase> {
    const usecase = await this.usecaseRepository.findOne({ where: { id }, relations: ['project'] });
    if (!usecase) {
      throw new NotFoundException(`El caso de uso con ID ${id} no existe`);
    }
    return usecase;
  }

  async update(id: number, updateUsecaseDto: UpdateUsecaseDto): Promise<Usecase> {
    await this.usecaseRepository.update(id, updateUsecaseDto);
    const updatedUsecase = await this.usecaseRepository.findOne({ where: { id } });
    if (!updatedUsecase) {
      throw new NotFoundException(`El caso de uso con ID ${id} no existe`);
    }
    return updatedUsecase;
  }

  async remove(id: number): Promise<void> {
    const usecase = await this.findOne(id);
    await this.usecaseRepository.remove(usecase);
  }
}
