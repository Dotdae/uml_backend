export const angularComponentPrompt = (componentName: string, componentDescription: string) => `
You are a professional Angular developer.
Generate a fully working Angular component with the following requirements:

Component name: ${componentName}
Description: ${componentDescription}

It should include:
- TypeScript component class
- HTML template
- SCSS stylesheet
- Angular service if needed
- Proper Angular module declaration

Make sure to:
- Follow Angular best practices
- Use reactive forms if forms are needed
- Keep file names and class names consistent
- Use camelCase for variables, PascalCase for classes
- Return code as separate blocks: 
--- filename.ts, filename.html, filename.scss, etc.
`;

export const angularServicePrompt = (serviceName: string, serviceResponsibilities: string) => `
You are a professional Angular developer.
Generate a service called ${serviceName} with the following responsibilities:

${serviceResponsibilities}

It should:
- Use HttpClientModule if calling APIs
- Be injectable
- Follow Angular best practices
- Be testable and modular
`;
