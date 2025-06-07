import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagramType } from './entities/diagram-type.entity';
import { DiagramTypeService } from './diagram-type.service';
import { DiagramTypeController } from './diagram-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiagramType])],
  controllers: [DiagramTypeController],
  providers: [DiagramTypeService],
  exports: [DiagramTypeService],
})
export class DiagramTypeModule {} 