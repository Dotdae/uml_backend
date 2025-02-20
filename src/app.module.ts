import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ProyectsModule } from './proyects/proyects.module';
import { SequenceModule } from './diagrams/sequence/sequence.module';
import { ClassModule } from './diagrams/class/class.module';
import { PackageModule } from './diagrams/package/package.module';
import { UsecaseModule } from './diagrams/usecase/usecase.module';
import { ComponentModule } from './diagrams/component/component.module';

@Module({
  imports: [ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    ProyectsModule,
    SequenceModule,
    ClassModule,
    PackageModule,
    UsecaseModule,
    ComponentModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
