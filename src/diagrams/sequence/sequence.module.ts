import { Module } from '@nestjs/common';
import { SequenceService } from './sequence.service';
import { SequenceController } from './sequence.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sequence } from './entities/sequence.entity';

@Module({
  controllers: [SequenceController],
  providers: [SequenceService],
  imports: [
    TypeOrmModule.forFeature([Sequence])
  ]
})
export class SequenceModule {}
