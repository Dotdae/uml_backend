export const angularPrompt = (
  type: 'component' | 'service' | 'model',
  name: string,
  descriptionOrResponsibilitiesOrProperties: string
) => {
  const sharedHeader = `You are a professional Angular developer.`;

  const sharedRequirements = `Requirements:
- Generate TypeScript code blocks with file paths in comments
- Include all necessary imports
- Follow Angular and TypeScript best practices
- Add proper types and interfaces`;

  const sharedExamples = {
    component: `\`\`\`typescript
// src/app/components/example/example.component.ts
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
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
// src/app/components/example/example.component.css
.example {
  // styles here
}
\`\`\``,
    service: `\`\`\`typescript
// src/app/services/example.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  constructor(private http: HttpClient) {}
}
\`\`\``,
    model: `\`\`\`typescript
// src/app/models/example.model.ts
export interface Example {
  id: number;
  name: string;
}
\`\`\``,
  };

  const specifics = {
    component: {
      title: `Generate a complete Angular component for: ${name}`,
      description: `Description:\n${descriptionOrResponsibilitiesOrProperties}`,
      additional: `- Include component, template, and styles\n- Use proper decorators and lifecycle hooks`,
    },
    service: {
      title: `Generate a complete Angular service for: ${name}`,
      description: `Responsibilities:\n${descriptionOrResponsibilitiesOrProperties}`,
      additional: `- Include HTTP client methods if needed\n- Use proper decorators and error handling`,
    },
    model: {
      title: `Generate a complete Angular model/interface for: ${name}`,
      description: `Properties:\n${descriptionOrResponsibilitiesOrProperties}`,
      additional: `- Include proper type definitions\n- Add JSDoc comments for documentation`,
    },
  };

  const s = specifics[type];

  return `${sharedHeader}
${s.title}

${s.description}

${sharedRequirements}
${s.additional}

Example format:
${sharedExamples[type]}

Generate the complete ${type} implementation:`;
};
