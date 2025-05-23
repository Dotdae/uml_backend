import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './entities/component.entity';
import { Proyect } from 'src/proyects/entities/proyect.entity';
import { ProyectsModule } from 'src/proyects/proyects.module';

@Module({
  controllers: [ComponentController],
  providers: [ComponentService],
  imports: [
    TypeOrmModule.forFeature([Component]), ProyectsModule
  ]
})
export class ComponentModule {}
