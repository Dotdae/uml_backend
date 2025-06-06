// generated/nest/src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZzzzzzModule } from './modules/zzzzzz.module';
import { NewActorModule } from './modules/new-actor.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'mygeneratedproject.db',
      entities: [__dirname + '/entities/*.entity.{ts,js}'],
      synchronize: true,
    }),
    ZzzzzzModule,
    NewActorModule,
  ],
})
export class AppModule {}