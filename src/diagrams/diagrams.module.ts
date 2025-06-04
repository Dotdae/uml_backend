import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Diagram } from './entities/diagram.entity';
import { DiagramsService } from './diagrams.service';
import { DiagramsController } from './diagrams.controller';
import { DiagramTypeModule } from './diagram-type.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Diagram]),
    DiagramTypeModule,
  ],
  controllers: [DiagramsController],
  providers: [DiagramsService],
  exports: [DiagramsService],
})
export class DiagramsModule {}
