import { Module } from '@nestjs/common';
import { UsecaseService } from './usecase.service';
import { UsecaseController } from './usecase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usecase } from './entities/usecase.entity';

import { Sequence } from '../sequence/entities/sequence.entity';
import { ProyectsModule } from 'src/proyects/proyects.module';

@Module({
  controllers: [UsecaseController],
  providers: [UsecaseService],
  imports: [
    TypeOrmModule.forFeature([Usecase]), ProyectsModule, Sequence
  ],
  
  
})
export class UsecaseModule {}
