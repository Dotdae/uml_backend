import { Injectable } from '@nestjs/common';
import { CreateProyectDto } from './dto/create-proyect.dto';
import { UpdateProyectDto } from './dto/update-proyect.dto';

@Injectable()
export class ProyectsService {
  create(createProyectDto: CreateProyectDto) {
    return 'This action adds a new proyect';
  }

  findAll() {
    return `This action returns all proyects`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proyect`;
  }

  update(id: number, updateProyectDto: UpdateProyectDto) {
    return `This action updates a #${id} proyect`;
  }

  remove(id: number) {
    return `This action removes a #${id} proyect`;
  }
}
