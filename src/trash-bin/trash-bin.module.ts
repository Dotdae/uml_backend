import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrashBin } from './entities/trash-bin.entity';
import { Project } from '../projects/entities/project.entity';
import { TrashBinService } from './trash-bin.service';
import { TrashBinController } from './trash-bin.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrashBin, Project]),
    UsersModule
  ],
  controllers: [TrashBinController],
  providers: [TrashBinService],
  exports: [TrashBinService],
})
export class TrashBinModule {}
