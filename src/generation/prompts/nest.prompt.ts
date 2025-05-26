export const nestModulePrompt = (moduleName: string, responsibilities: string) => `
You are a professional NestJS developer.
Generate a complete NestJS module for: ${moduleName}

Responsibilities:
${responsibilities}

Requirements:
- Generate TypeScript code blocks with file paths in comments
- Include all necessary imports
- Follow NestJS best practices
- Use TypeORM decorators if needed
- Add proper types and interfaces

Example format:
\`\`\`typescript
// src/modules/example.module.ts
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [],
  providers: []
})
export class ExampleModule {}
\`\`\`

Generate the complete module implementation:`;

export const nestEntityPrompt = (entityName: string, fields: string) => `
You are a professional NestJS developer.
Generate a TypeORM entity for ${entityName} with the following fields:

${fields}

Requirements:
- Generate TypeScript code blocks with file paths in comments
- Include all necessary imports
- Use TypeORM decorators (@Entity, @Column, etc.)
- Add proper validation decorators
- Include relationships if specified
- Add proper types and interfaces

Example format:
\`\`\`typescript
// src/entities/example.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Example {
  @PrimaryGeneratedColumn()
  id: number;
}
\`\`\`

Generate the complete entity implementation:`;

export const nestControllerPrompt = (resourceName: string, actions: string) => `
You are a professional NestJS developer.
Generate a RESTful controller for ${resourceName} with the following actions:

${actions}

Requirements:
- Generate TypeScript code blocks with file paths in comments
- Include all necessary imports
- Use proper HTTP decorators
- Add request/response DTOs
- Include Swagger documentation
- Add proper types and interfaces

Example format:
\`\`\`typescript
// src/controllers/example.controller.ts
import { Controller, Get } from '@nestjs/common';

@Controller('example')
export class ExampleController {
  @Get()
  findAll() {
    return [];
  }
}
\`\`\`

Generate the complete controller implementation and any necessary DTOs:`;

export const nestDtoPrompt = (dtoName: string, fields: string) => `
You are a professional NestJS developer.
Generate DTOs for ${dtoName} with the following fields:

${fields}

Requirements:
- Generate TypeScript code blocks with file paths in comments
- Include all necessary imports
- Use class-validator decorators
- Add proper types and interfaces
- Include both Create and Update DTOs

Example format:
\`\`\`typescript
// src/dto/create-example.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateExampleDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
\`\`\`

Generate the complete DTO implementations:`;