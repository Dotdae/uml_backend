// src/modules/default/default.component.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class DefaultComponent {
  getDefaultMessage(): string {
    return 'Hello from DefaultComponent!';
  }
}