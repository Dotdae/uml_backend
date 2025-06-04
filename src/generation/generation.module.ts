import { Module } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { GenerationController } from './generation.controller';

import { GeminiService } from './gemini/gemini.service';
import { ProjectsModule } from 'src/projects/projects.module';

@Module({
  imports: [ProjectsModule], // Assuming ProjectsModule is defined and imported correctly
  providers: [GenerationService, GeminiService],
  controllers: [GenerationController]
})
export class GenerationModule {}
