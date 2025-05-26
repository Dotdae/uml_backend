import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Proyect } from './entities/proyect.entity';
import { User } from 'src/users/entities/user.entity';


@Injectable()
export class ProyectsService {
  constructor(
    @InjectRepository(Proyect)
    private readonly proyectRepository: Repository<Proyect>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async create(createProyectDto: CreateProyectDto): Promise<Proyect> {
    const user = await this.userRepository.findOneBy({
      id: createProyectDto.userID,
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Crea el nuevo proyecto
    const proyect = this.proyectRepository.create({
      name: createProyectDto.name,
      userID: user, // Asigna el objeto de usuario completo
    });

    return await this.proyectRepository.save(proyect);
  }

  async findAll() {
    const proyects = await this.proyectRepository.find();
    return proyects;
  }

  async findOne(id: number) {
    const proyect = await this.proyectRepository.findOne({
      where: { id },
      relations: {
        userID: true,
        sequence: true,
        clase: true,
        usecase: true,
        paquete: true,
        component: true,
      },
    });

    if (!proyect) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    return proyect;
  }

  async findOneBy(id: number): Promise<Proyect> {
    const proyect = await this.proyectRepository.findOne({
      where: { id },
      relations: {
        userID: true,
        sequence: true,
        clase: true,
        usecase: true,
        paquete: true,
        component: true,
      },
    });

    if (!proyect) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    return proyect;
  }

  async findAllByUser(userId: string): Promise<Proyect[]> {
    // Verificar que el usuario existe
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado`);
    }

    // Buscar todos los proyectos donde userID coincide con el userId proporcionado
    const proyects = await this.proyectRepository.find({
      where: {
        userID: { id: userId },
      },
    });

    return proyects;
  }

  async update(
    id: number,
    updateProyectDto: UpdateProyectDto,
  ): Promise<Proyect> {
    // Buscar el proyecto existente
    const proyect = await this.proyectRepository.findOneBy({ id });

    // Si no se encuentra el proyecto, lanzar una excepción
    if (!proyect) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado`);
    }

    // Actualizar el nombre del proyecto
    proyect.name = updateProyectDto.name;

    // Guardar y devolver el proyecto actualizado
    return await this.proyectRepository.save(proyect);
  }

  async deleteProjectById(projectId: number): Promise<void> {
    const result = await this.proyectRepository.delete(projectId);

    if (result.affected === 0) {
      throw new NotFoundException(`El proyecto con ID ${projectId} no existe`);
    }
  }

  async getProjectDiagrams(projectId: number): Promise<any> {
    const project = await this.proyectRepository.findOne({
      where: { id: projectId },
      relations: {
        sequence: true,
        clase: true,
        usecase: true,
        paquete: true,
        component: true,
      },
    });
  
    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${projectId} no encontrado`);
    }
  
    return {
      classDiagrams: project.clase || [],
      sequenceDiagrams: project.sequence || [],
      usecaseDiagrams: project.usecase || [],
      packageDiagrams: project.paquete || [],
      componentDiagrams: project.component || [],
    };
  }
}
