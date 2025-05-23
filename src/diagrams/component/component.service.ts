import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Component } from './entities/component.entity';
import { Proyect } from 'src/proyects/entities/proyect.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ComponentService {

  constructor(
    @InjectRepository(Component)
    private readonly componentRepository: Repository<Component>,

    @InjectRepository(Proyect)
    private readonly projectRepository: Repository<Proyect>,
  ) {}

  
  
  // 🔹 Crear un nuevo componente
  async create(createComponentDto: CreateComponentDto): Promise<Component> {
    const { info, projectId } = createComponentDto;

    // Verificar que el proyecto existe
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`El proyecto con ID ${projectId} no existe`);
    }

    const newComponent = this.componentRepository.create({
      info,
      project,
    });

    return await this.componentRepository.save(newComponent);
  }

   // 🔹 Obtener todos los componentes
   async findAll(): Promise<Component[]> {
    return await this.componentRepository.find({ relations: ['project'] });
  }

  findOne(id: number) {
    return `This action returns a #${id} component`;
  }

  
  // 🔹 Actualizar un componente
  async update(id: number, updateComponentDto: UpdateComponentDto): Promise<Component> {
    const component = await this.componentRepository.findOne({ where: { id } });

    if (!component) {
      throw new NotFoundException(`El componente con ID ${id} no existe`);
    }

    // Actualizar solo los campos proporcionados
    Object.assign(component, updateComponentDto);

    return await this.componentRepository.save(component);
  }

   // 🔹 Eliminar un componente
   async remove(id: number): Promise<void> {
    const result = await this.componentRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El componente con ID ${id} no existe`);
    }
  }
}
