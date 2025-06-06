// generated/nest/src/modules/new-actor.module.ts
import { Module } from '@nestjs/common';
import { NewActorController } from '../controllers/new-actor.controller';
import { NewActorService } from '../services/new-actor.service';

@Module({
  controllers: [NewActorController],
  providers: [NewActorService],
})
export class NewActorModule {}