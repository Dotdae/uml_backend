import { Module } from '@nestjs/common';
import { ProyectsService } from './proyects.service';
import { ProyectsController } from './proyects.controller';
import { Proyect } from './entities/proyect.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { PackageModule } from 'src/diagrams/package/package.module';
import { UsecaseModule } from 'src/diagrams/usecase/usecase.module';
import { SequenceModule } from 'src/diagrams/sequence/sequence.module';
import { ClassModule } from 'src/diagrams/class/class.module';
import { ComponentModule } from 'src/diagrams/component/component.module';

@Module({
  controllers: [ProyectsController],
  providers: [ProyectsService],
  imports: [
    TypeOrmModule.forFeature([Proyect, User]),
  ],
  exports: [
    ProyectsService,
    TypeOrmModule,
  ],
})
export class ProyectsModule {}