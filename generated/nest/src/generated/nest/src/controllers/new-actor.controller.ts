// generated/nest/src/controllers/new-actor.controller.ts
import { Controller, Get } from '@nestjs/common';
import { NewActorService } from '../services/new-actor.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('new-actor')
@Controller('newactor')
export class NewActorController {
  constructor(private readonly newActorService: NewActorService) {}

  @Get()
  @ApiOperation({ summary: 'Get new actor' })
  getNewActor(): Promise<string> {
    return this.newActorService.getNewActor();
  }

  @Get('again')
  @ApiOperation({ summary: 'Get new actor again' })
  getNewActorAgain(): Promise<string> {
    return this.newActorService.getNewActorAgain();
  }
}