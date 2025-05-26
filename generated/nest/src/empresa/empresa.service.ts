// src/empresa/empresa.service.ts
   import { Injectable } from '@nestjs/common';
   import { InjectRepository } from '@nestjs/typeorm';
   import { Repository } from 'typeorm';
   import { Empresa } from '../entities/empresa.entity';

   @Injectable()
   export class EmpresaService {
     constructor(
       @InjectRepository(Empresa)
       private empresaRepository: Repository<Empresa>,
     ) {}

     async create(empresaData: Partial<Empresa>): Promise<Empresa> {
       const empresa = this.empresaRepository.create(empresaData);
       return this.empresaRepository.save(empresa);
     }

     async findAll(): Promise<Empresa[]> {
       return this.empresaRepository.find();
     }
   }