import { Controller, Get, Param, ParseIntPipe, Res } from '@nestjs/common';
import { GenerationService } from './generation.service';
import { Response } from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('generation')
@ApiBearerAuth('JWT-auth')
@Controller('generation')
export class GenerationController {
  constructor(private readonly generationService: GenerationService) {}

  @Get('project/:id')
  async generateProject(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    const zipBuffer = await this.generationService.generateFullProject(id);

    res.set({
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="project-${id}.zip"`,
    });

    res.send(zipBuffer);
  }
}
