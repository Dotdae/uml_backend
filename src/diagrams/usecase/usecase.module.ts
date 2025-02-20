import { Module } from '@nestjs/common';
import { UsecaseService } from './usecase.service';
import { UsecaseController } from './usecase.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usecase } from './entities/usecase.entity';

@Module({
  controllers: [UsecaseController],
  providers: [UsecaseService],
  imports: [
    TypeOrmModule.forFeature([Usecase])
  ]
})
export class UsecaseModule {}
