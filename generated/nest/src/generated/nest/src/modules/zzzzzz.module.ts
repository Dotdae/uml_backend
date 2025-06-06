// generated/nest/src/modules/zzzzzz.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZzzzzzService } from '../services/zzzzzz.service';
import { ZzzzzzController } from '../controllers/zzzzzz.controller';
import { Zzzzzz } from '../entities/zzzzzz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Zzzzzz])],
  providers: [ZzzzzzService],
  controllers: [ZzzzzzController],
})
export class ZzzzzzModule {}