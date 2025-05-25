import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { Class } from './entities/class.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Proyect } from 'src/proyects/entities/proyect.entity';
import { GeminiModule } from 'src/gemini/gemini.module';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
  imports: [
    TypeOrmModule.forFeature([Class, Proyect]),
    GeminiModule
  ]
})
export class ClassModule {}
