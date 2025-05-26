// src/modules/default/default.module.ts
import { Module } from '@nestjs/common';
import { DefaultComponent } from './default.component';

@Module({
  imports: [],
  controllers: [],
  providers: [DefaultComponent],
  exports: [DefaultComponent],
})
export class DefaultModule {}