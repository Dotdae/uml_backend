import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { DiagramTypeModule } from './diagrams/diagram-type.module';
import { DiagramsModule } from './diagrams/diagrams.module';
import { MailModule } from './mail/mail.module';
import { StatusModule } from './status/status.module';
import { TrashBinModule } from './trash-bin/trash-bin.module';
import { Project } from './projects/entities/project.entity';
import { DiagramType } from './diagrams/entities/diagram-type.entity';
import { Diagram } from './diagrams/entities/diagram.entity';
import { User } from './users/entities/user.entity';
import { Status } from './status/entities/status.entity';
import { TrashBin } from './trash-bin/entities/trash-bin.entity';
import { GenerationModule } from './generation/generation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log('Database configuration:', {
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          database: configService.get('DB_NAME'),
        });
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: +configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_NAME'),
          entities: [User, Project, DiagramType, Diagram, Status, TrashBin],
          synchronize: true,
          logging: true,
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    ProjectsModule,
    DiagramTypeModule,
    DiagramsModule,
    MailModule,
    StatusModule,
    TrashBinModule,
    GenerationModule,
  ],
})
export class AppModule {}
