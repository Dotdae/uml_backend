import { Injectable } from '@nestjs/common';
import { CreateSequenceDto } from './dto/create-sequence.dto';
import { UpdateSequenceDto } from './dto/update-sequence.dto';

@Injectable()
export class SequenceService {
  create(createSequenceDto: CreateSequenceDto) {
    return 'This action adds a new sequence';
  }

  findAll() {
    return `This action returns all sequence`;
  }

  findOne(id: number) {
    return `This action returns a #${id} sequence`;
  }

  update(id: number, updateSequenceDto: UpdateSequenceDto) {
    return `This action updates a #${id} sequence`;
  }

  remove(id: number) {
    return `This action removes a #${id} sequence`;
  }
}
