import { Module } from '@nestjs/common';
import { ComponentService } from './component.service';
import { ComponentController } from './component.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Component } from './entities/component.entity';

@Module({
  controllers: [ComponentController],
  providers: [ComponentService],
  imports: [
    TypeOrmModule.forFeature([Component])
  ]
})
export class ComponentModule {}
