import { Module } from '@nestjs/common';
import { ProyectsService } from './proyects.service';
import { ProyectsController } from './proyects.controller';
import { Proyect } from './entities/proyect.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [ProyectsController],
  providers: [ProyectsService],
  imports: [
    TypeOrmModule.forFeature([Proyect])
  ]
})
export class ProyectsModule {}
