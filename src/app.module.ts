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
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT! || 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
    ProyectsModule,
    SequenceModule,
    ClassModule,
    PackageModule,
    UsecaseModule,
    ComponentModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
