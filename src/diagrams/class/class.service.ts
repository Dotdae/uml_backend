import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { UpdateClassDto } from './dto/update-class.dto';
import { Proyect } from 'src/proyects/entities/proyect.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { GeminiService } from 'src/gemini/gemini.service';


@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,

    @InjectRepository(Proyect)
    private readonly projectRepository: Repository<Proyect>,
    private readonly geminiService: GeminiService,
  ) { }


  // Crear una nueva clase
  async create(createClassDTO: CreateClassDto): Promise<Class> {
    const { info, projectId } = createClassDTO;

    // Verificar que el proyecto existe
    const project = await this.projectRepository.findOne({ where: { id: projectId } });
    if (!project) {
      throw new NotFoundException(`El proyecto con ID ${projectId} no existe`);
    }

    const newClass = this.classRepository.create({
      info,
      project,
    });

    return await this.classRepository.save(newClass);
  }

  findAll() {
    return `This action returns all class`;
  }

  // Obtener diagrama por ID
  async findOne(id: number): Promise<Class> {
    const foundClass = await this.classRepository.findOne({ where: { id }, relations: ['project'] });

    if (!foundClass) {
      throw new NotFoundException(`La clase con ID ${id} no existe`);
    }

    return foundClass;
  }

  async update(id: number, updateClassDto: UpdateClassDto) {
    const existingClass = await this.classRepository.preload({
      id,
      ...updateClassDto, // ✅ Aseguramos que sea un objeto
    });

    if (!existingClass) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }

    return this.classRepository.save(existingClass);
  }


  async delete(id: number): Promise<void> {
    const result = await this.classRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`La clase con ID ${id} no existe`);
    }
  }

  async generateCodeFromDiagram(id: number, language: string): Promise<string> {
    const classDiagram = await this.findOne(id);

    if (!classDiagram) {
      throw new NotFoundException(`Class diagram with ID ${id} not found`);
    }

    // Usar el servicio de Gemini para generar el código
    try {
      const generatedCode = await this.geminiService.generateCodeFromUML(
        classDiagram.info,
        language
      );
      return generatedCode;
    } catch (error) {
      throw new InternalServerErrorException('Failed to generate code from diagram');
    }
  }


}
