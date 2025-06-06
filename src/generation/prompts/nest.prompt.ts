export const nestUnifiedPrompt = (projectName: string, context: {
  entities: { name: string, fields: string }[],
  dtos: { name: string, fields: string }[],
  services: { name: string, responsibilities: string }[],
  controllers: { resource: string, actions: string }[],
  modules: { name: string, responsibilities: string }[],
}) => `
You are a professional NestJS developer.
Generate a complete NestJS backend project for: ${projectName}

## Overview:
Generate all components needed for a working application:
- TypeORM entities
- DTOs (create & update)
- RESTful controllers
- NestJS services
- NestJS modules
- Root application bootstrap files: \`app.module.ts\` and \`main.ts\`

---

## ENTITIES

### Entities to generate:
${context.entities.map(e => `- ${e.name}: ${e.fields}`).join('\n')}

### Example format:
\`\`\`typescript
// src/entities/user.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
\`\`\`

---

## DTOS

### DTOs to generate:
${context.dtos.map(d => `- ${d.name}: ${d.fields}`).join('\n')}

### Example format:
\`\`\`typescript
// src/dto/create-user.dto.ts
import { IsEmail, IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;
}
\`\`\`

\`\`\`typescript
// src/dto/update-user.dto.ts
import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
\`\`\`

---

## SERVICES

### Services to generate:
${context.services.map(s => `- ${s.name}: ${s.responsibilities}`).join('\n')}

### Example format:
\`\`\`typescript
// src/services/user.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(dto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOne(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
\`\`\`

---

## CONTROLLERS

### Controllers to generate:
${context.controllers.map(c => `- ${c.resource}: ${c.actions}`).join('\n')}

### Example format:
\`\`\`typescript
// src/controllers/user.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a user' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(+id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
\`\`\`

---

## MODULES

### Modules to generate:
${context.modules.map(m => `- ${m.name}: ${m.responsibilities}`).join('\n')}

### Example format:
\`\`\`typescript
// src/modules/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { User } from '../entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
\`\`\`

---

## ROOT FILES

### Example for \`app.module.ts\`:
\`\`\`typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'mydb',
      entities: [__dirname + '/entities/*.entity.{ts,js}'],
      synchronize: true,
    }),
    UserModule,
  ],
})
export class AppModule {}
\`\`\`

### Example for \`main.ts\`:
\`\`\`typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
\`\`\`


---

## PROJECT STRUCTURE

The generated project must follow this folder and file structure under the base path:

\`\`\`
generated/nest/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── controllers/
│   │   └── *.controller.ts
│   ├── services/
│   │   └── *.service.ts
│   ├── modules/
│   │   └── *.module.ts
│   ├── entities/
│   │   └── *.entity.ts
│   └── dto/
│       └── create-*.dto.ts
│       └── update-*.dto.ts
\`\`\`


> All code must be correctly placed according to this structure and should include necessary imports and decorators.


---

## Requirements:
- TypeScript code blocks with correct file paths in comments
- Proper NestJS best practices
- TypeORM + class-validator decorators
- Swagger docs in controllers and bootstrap
- Correct use of async/await and dependency injection
- Avoid placeholders or empty methods

Generate the full application now:
`;
