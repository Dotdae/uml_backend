export const nestModulePrompt = (moduleName: string, responsibilities: string) => `
You are a professional NestJS developer.
Generate a complete NestJS module for: ${moduleName}

Responsibilities:
${responsibilities}

Include:
- Controller with endpoints
- Service with logic
- DTOs for input validation
- Module declaration

Use:
- REST conventions
- TypeORM if persistence is needed
- Swagger decorators for API documentation
`;

export const nestEntityPrompt = (entityName: string, fields: string) => `
Generate a NestJS TypeORM entity named ${entityName} with the following fields:

${fields}

Include:
- Decorators for @Entity, @PrimaryGeneratedColumn, @Column
- Relations (ManyToOne, OneToMany, etc. if applicable)
- Appropriate types and nullable config
`;

export const nestControllerPrompt = (resourceName: string, actions: string) => `
You are a professional NestJS developer.
Generate a RESTful controller for ${resourceName} with the following actions:

${actions}

Include:
- Swagger decorators
- HTTP status codes
- Proper DTO usage for validation
- Inject the corresponding service
`;