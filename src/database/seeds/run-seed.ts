import { DataSource } from 'typeorm';
import { seed } from './seed';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from '../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { DiagramType } from '../../diagrams/entities/diagram-type.entity';
import { Diagram } from '../../diagrams/entities/diagram.entity';

config();

const configService = new ConfigService();

const dataSource = new DataSource({
  type: 'postgres',
  host: configService.get('DB_HOST'),
  port: +configService.get('DB_PORT'),
  username: configService.get('DB_USER'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_NAME'),
  entities: [User, Project, DiagramType, Diagram],
  synchronize: true,
});

async function runSeed() {
  try {
    await dataSource.initialize();
    await seed(dataSource);
    await dataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('Error running seed:', error);
    process.exit(1);
  }
}

runSeed(); 