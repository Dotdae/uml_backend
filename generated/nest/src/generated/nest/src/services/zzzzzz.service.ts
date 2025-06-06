// generated/nest/src/services/zzzzzz.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zzzzzz } from '../entities/zzzzzz.entity';

@Injectable()
export class ZzzzzzService {
  constructor(
    @InjectRepository(Zzzzzz)
    private zzzzzzRepository: Repository<Zzzzzz>,
  ) {}

  async findAll(): Promise<Zzzzzz[]> {
    return this.zzzzzzRepository.find();
  }
}