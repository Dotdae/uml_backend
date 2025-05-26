export const angularComponentPrompt = (componentName: string, description: string) => `
You are a professional Angular developer.
Generate a complete Angular component for: ${componentName}

Description:
${description}

Requirements:
- Generate TypeScript code blocks with file paths in comments
- Include all necessary imports
- Follow Angular best practices
- Add proper types and interfaces
- Include component, template, and styles
- Use proper decorators and lifecycle hooks

Example format:
\`\`\`typescript
// src/app/components/example/example.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss']
})
export class ExampleComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
\`\`\`

\`\`\`typescript
// src/app/components/example/example.component.html
<div>
  <h1>Example Component</h1>
</div>
\`\`\`

\`\`\`typescript
// src/app/components/example/example.component.scss
.example {
  // styles here
}
\`\`\`

Generate the complete component implementation:`;

export const angularServicePrompt = (serviceName: string, responsibilities: string) => `
You are a professional Angular developer.
Generate a complete Angular service for: ${serviceName}

Responsibilities:
${responsibilities}

Requirements:
- Generate TypeScript code blocks with file paths in comments
- Include all necessary imports
- Follow Angular best practices
- Add proper types and interfaces
- Include HTTP client methods if needed
- Use proper decorators and error handling

Example format:
\`\`\`typescript
// src/app/services/example.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  constructor(private http: HttpClient) {}
}
\`\`\`

Generate the complete service implementation:`;

export const angularModelPrompt = (modelName: string, properties: string) => `
You are a professional Angular developer.
Generate a complete Angular model/interface for: ${modelName}

Properties:
${properties}

Requirements:
- Generate TypeScript code blocks with file paths in comments
- Include all necessary imports
- Follow TypeScript best practices
- Add proper types and interfaces
- Include proper type definitions
- Add JSDoc comments for documentation

Example format:
\`\`\`typescript
// src/app/models/example.model.ts
export interface Example {
  id: number;
  name: string;
}
\`\`\`

Generate the complete model implementation:`;
