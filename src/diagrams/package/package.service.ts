import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proyect } from 'src/proyects/entities/proyect.entity';
import { Package } from './entities/package.entity';

@Injectable()
export class PackageService {

  constructor(
    @InjectRepository(Package)
    private readonly packageRepository: Repository<Package>,

    @InjectRepository(Proyect)
    private readonly projectRepository: Repository<Proyect>,
  ) {}

  
    // 🔹 Crear un nuevo diagrama de paquetes
    async create(createPackageDto: CreatePackageDto): Promise<Package> {
      const { info, projectId } = createPackageDto;
  
      // Verificar que el proyecto existe
      const project = await this.projectRepository.findOne({ where: { id: projectId } });
      if (!project) {
        throw new NotFoundException(`El proyecto con ID ${projectId} no existe`);
      }
  
      const newPackage = this.packageRepository.create({
        info,
        project,
      });
  
      return await this.packageRepository.save(newPackage);
    }

   // 🔹 Obtener todos los paquetes
   async findAll(): Promise<Package[]> {
    return await this.packageRepository.find({ relations: ['project'] });
  }
  findOne(id: number) {
    return `This action returns a #${id} package`;
  }

   // 🔹 Actualizar un paquete
   async update(id: number, updatePackageDto: UpdatePackageDto): Promise<Package> {
    const packageItem = await this.packageRepository.findOne({ where: { id } });

    if (!packageItem) {
      throw new NotFoundException(`El paquete con ID ${id} no existe`);
    }

    // Actualizar solo los campos proporcionados
    Object.assign(packageItem, updatePackageDto);

    return await this.packageRepository.save(packageItem);
  }

   // 🔹 Eliminar un paquete
   async remove(id: number): Promise<void> {
    const result = await this.packageRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El paquete con ID ${id} no existe`);
    }
  }
}
