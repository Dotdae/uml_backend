// generated/nest/src/controllers/zzzzzz.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ZzzzzzService } from '../services/zzzzzz.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Zzzzzz } from 'src/entities/zzzzzz.entity';

@ApiTags('zzzzzz')
@Controller('zzzzzz')
export class ZzzzzzController {
  constructor(private readonly zzzzzzService: ZzzzzzService) {}

  @Get()
  @ApiOperation({ summary: 'Get all zzzzzz entities' })
  findAll(): Promise<Zzzzzz[]> {
    return this.zzzzzzService.findAll();
  }
}