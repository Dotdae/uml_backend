import { Module } from '@nestjs/common';
import { ClassService } from './class.service';
import { ClassController } from './class.controller';
import { Class } from './entities/class.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ClassController],
  providers: [ClassService],
  imports: [
    TypeOrmModule.forFeature([Class])
  ]
})
export class ClassModule {}
