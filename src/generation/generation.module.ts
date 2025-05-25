import { Module } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { GenerationController } from './generation.controller';
import { ProyectsModule } from '../proyects/proyects.module'; // Adjust the import path as necessary
import { GeminiService } from './gemini/gemini.service';

@Module({
  imports: [ProyectsModule], // Assuming ProjectsModule is defined and imported correctly
  providers: [GenerationService, GeminiService],
  controllers: [GenerationController]
})
export class GenerationModule {}
