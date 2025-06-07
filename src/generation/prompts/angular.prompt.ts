export const angularPrompt = (
  type: 'component' | 'service' | 'model' | 'main',
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
    main: `\`\`\`typescript
// src/main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
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
    main: {
      title: `Generate the entry point file for Angular (main.ts)`,
      description: `This file should bootstrap the main Angular module (AppModule)`,
      additional: `- Use platformBrowserDynamic to bootstrap AppModule\n- Handle errors appropriately`,
    },
  };

  const projectStructure = `
---

## PROJECT STRUCTURE

The Angular project must follow this exact folder structure, starting from the root directory:

\`\`\`
generated/angular/
├── src/
│   ├── main.ts
│   ├── index.html
│   ├── styles.css
│   ├── app/
│   │   ├── app.module.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   ├── components/
│   │   │   └── [name]/
│   │   │       ├── [name].component.ts
│   │   │       ├── [name].component.html
│   │   │       ├── [name].component.css
│   │   ├── services/
│   │   │   └── [name].service.ts
│   │   ├── models/
│   │   │   └── [name].model.ts
│   │   ├── pages/
│   │   │   └── [name]/
│   │   │       ├── [name].page.ts
│   │   │       ├── [name].page.html
│   │   │       ├── [name].page.css
│   │   ├── routing/
│   │   │   └── app-routing.module.ts
\`\`\`

### Guidelines:
- Do **not** nest folders unnecessarily (e.g., avoid \`angular/angular/src\` or \`src/src/app\`).
- Place UI components inside \`components/\`, full views in \`pages/\`, and data models in \`models/\`.
- Register all services and components in their respective module files.
- Follow Angular CLI conventions and Angular 13+ best practices.

---

## Requirements:
- Code must be TypeScript-based and compile-ready.
- Use Angular decorators properly.
- HTML and CSS must be included in separate files for each component and page.
- Use \`app-routing.module.ts\` to define all application routes.
- Avoid boilerplate placeholders; include meaningful logic and structure.
`;

  const s = specifics[type];

  return `${sharedHeader}
${s.title}

${s.description}

${sharedRequirements}
${s.additional}

Example format:
${sharedExamples[type]}

Generate the complete ${type} implementation:
${projectStructure}`;
};
