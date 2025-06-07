import { Injectable, Logger } from '@nestjs/common';
import { ProjectsService } from 'src/projects/projects.service';
import { GeminiService } from './gemini/gemini.service';
import { parseClassDiagram } from './parse/class.parser';
import { parseUsecaseDiagram } from './parse/usecase.parser';
import { parseComponentDiagram } from './parse/component.parser';
import { parsePackageDiagram } from './parse/package.parser';
import { parseSequenceDiagram } from './parse/sequence.parser';
import { parsePromptOutput } from './parse/prompt-output-parser';
import { nestUnifiedPrompt } from './prompts/nest.prompt';
import { ProjectBuilder } from './assembler/project-builder';
import { zipGeneratedProject } from './zip';

@Injectable()
export class GenerationService {
  private readonly logger = new Logger(GenerationService.name);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly geminiService: GeminiService
  ) {}

  async generateNestProject(projectId: number): Promise<Buffer> {
    this.logger.log(`Starting NestJS code generation for project ${projectId}`);

    try {
      const diagrams = await this.projectsService.getProjectDiagramsGrouped(projectId);
      this.logger.log(`Found diagrams: 
        Class: ${diagrams.classDiagrams?.length || 0},
        Sequence: ${diagrams.sequenceDiagrams?.length || 0},
        Component: ${diagrams.componentDiagrams?.length || 0},
        Package: ${diagrams.packageDiagrams?.length || 0},
        UseCase: ${diagrams.usecaseDiagrams?.length || 0}`);

      const parsedContext = {
        entities: [],
        dtos: [],
        services: [],
        controllers: [],
        modules: [],
      };

      // Class Diagrams
      for (const diagram of diagrams.classDiagrams || []) {
        const parsedClasses = parseClassDiagram(JSON.parse(diagram.info));
        for (const parsed of parsedClasses) {
          const fields = parsed.fields.map(f =>
            `${f.name}: ${f.type}${f.nullable ? ' (nullable)' : ''}${f.primary ? ' (primary)' : ''} - ${f.visibility}`
          ).join('\n');

          parsedContext.entities.push({
            name: parsed.name,
            fields,
          });
        }
      }

      // Use Case Diagrams
      for (const diagram of diagrams.usecaseDiagrams || []) {
        const diagramInfo = JSON.parse(diagram.info);
        const parsed = parseUsecaseDiagram(diagramInfo);

        const actions = parsed.actions.map(a =>
          `${a.method} ${a.path} - ${a.name}: ${a.description || ''}`
        ).join('\n');

        parsedContext.controllers.push({
          resource: parsed.entity,
          actions,
        });

        parsedContext.services.push({
          name: parsed.entity,
          responsibilities: `Handle operations like:\n${actions}`,
        });

        parsedContext.dtos.push({
          name: `${parsed.entity}Dto`,
          fields: parsed.actions.map(a => `${a.name}: string`).join('\n'),
        });
      }

      // Package Diagrams
      for (const diagram of diagrams.packageDiagrams || []) {
        const diagramInfo = JSON.parse(diagram.info);
        const parsed = parsePackageDiagram(diagramInfo);

        for (const mod of parsed.modules || []) {
          const responsibilities = [
            mod.components?.length ? `Includes: ${mod.components.join(', ')}` : '',
            mod.dependencies?.length ? `Depends on: ${mod.dependencies.join(', ')}` : '',
          ].filter(Boolean).join('\n');

          parsedContext.modules.push({
            name: mod.name,
            responsibilities: responsibilities || 'No responsibilities defined',
          });
        }
      }

      // Component Diagrams
      for (const diagram of diagrams.componentDiagrams || []) {
        try {
          const parsed = parseComponentDiagram(JSON.parse(diagram.info));
          for (const comp of parsed.components) {
            parsedContext.services.push({
              name: comp.name,
              responsibilities: `Responsibilities: ${comp.responsibilities}\nDependencies: ${(comp.dependencies || []).join(', ')}`,
            });
          }
        } catch (error) {
          this.logger.error(`Error parsing component diagram: ${error.message}`, error.stack);
          continue;
        }
      }

      // Sequence Diagrams
      for (const diagram of diagrams.sequenceDiagrams || []) {
        try {
          const parsed = parseSequenceDiagram(JSON.parse(diagram.info));

          const interactions = parsed.messages.map(m =>
            `${m.from} -> ${m.to}: ${m.message} (${m.type})`
          ).join('\n');

          parsedContext.services.push({
            name: parsed.name,
            responsibilities: `Actor: ${parsed.actor}\nInteractions:\n${interactions}`
          });
        } catch (error) {
          this.logger.error(`Error parsing sequence diagram: ${error.message}`, error.stack);
          continue;
        }
      }

      // Prompt para generación NestJS
      const prompt = nestUnifiedPrompt('MyGeneratedProject', parsedContext);

      this.logger.log('Calling LLM to generate NestJS code...');
      const response = await this.callLLM(prompt);
      const files = parsePromptOutput(response);

      const builder = new ProjectBuilder();
      await builder.writeFiles(files);

      await zipGeneratedProject();
      const fs = await import('fs/promises');
      const buffer = await fs.readFile('generated/project.zip');

      const stats = await fs.stat('generated/project.zip');
      if (stats.size === 0) {
        throw new Error('Generated ZIP file is empty');
      }

      this.logger.log('NestJS project generated and zipped successfully!');
      return buffer;

    } catch (error) {
      this.logger.error(`Error generating NestJS project: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async callLLM(prompt: string): Promise<string> {
    try {
      const response = await this.geminiService.generateCode(prompt);
      return response;
    } catch (error) {
      this.logger.error(`LLM call failed: ${error.message}`, error.stack);
      throw error;
    }
  }
}
