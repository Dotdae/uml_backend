import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { Proyect } from 'src/proyects/entities/proyect.entity';

@Module({
  controllers: [PackageController],
  providers: [PackageService],
  imports: [
    TypeOrmModule.forFeature([Package, Proyect])
  ],
  
})
export class PackageModule {}
