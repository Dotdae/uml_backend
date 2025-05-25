import { Injectable, NotFoundException } from '@nestjs/common';
import { ProyectsService } from '../proyects/proyects.service';

import {
  angularComponentPrompt,
  angularServicePrompt,
} from './prompts/angular.prompt';
import {
  nestControllerPrompt,
  nestEntityPrompt,
  nestModulePrompt,
} from './prompts/nest.prompt';
import { ProjectBuilder } from './assembler/project-builder';
import { zipGeneratedProject } from './zip';


import { parseComponentDiagram } from './parse/component.parser';
import { parseUsecaseDiagram } from './parse/usecase.parser';
import { parseClassDiagram } from './parse/class.parser';
import { parseSequenceDiagram } from './parse/sequence.parser';
import { parsePackageDiagram } from './parse/package.parser';
import { parsePromptOutput } from './parse/prompt-output-parser';

@Injectable()
export class GenerationService {
  constructor(private readonly projectsService: ProyectsService) {}

  async generateFullProject(projectId: number): Promise<Buffer> {
    const diagrams = await this.projectsService.getProjectDiagrams(projectId);

    const builder = new ProjectBuilder();

    let allFiles = [];

    // 1. Class diagrams → Entities
    for (const diagram of diagrams.classDiagrams) {
      const parsed = parseClassDiagram(JSON.parse(diagram.info));
      const fields = parsed.fields.map(f =>
        `${f.name}: ${f.type}${f.nullable ? ' (nullable)' : ''}${f.primary ? ' (primary)' : ''}`
      ).join('\n');

      const entityPrompt = nestEntityPrompt(parsed.name, fields);
      const response = await this.callLLM(entityPrompt);
      allFiles.push(...parsePromptOutput(response));
    }

    // 2. Use case diagrams → Controller + Service + DTOs
    for (const diagram of diagrams.usecaseDiagrams) {
      const parsed = parseUsecaseDiagram(JSON.parse(diagram.info));
      const actions = parsed.actions.map(a =>
        `${a.method} ${a.path} - ${a.name}: ${a.description || ''}`
      ).join('\n');

      const controllerPrompt = nestControllerPrompt(parsed.entity, actions);
      const response = await this.callLLM(controllerPrompt);
      allFiles.push(...parsePromptOutput(response));
    }

    // 3. Component diagrams → Angular Services
    for (const diagram of diagrams.componentDiagrams) {
      const parsed = parseComponentDiagram(JSON.parse(diagram.info));
      const servicePrompt = angularServicePrompt(parsed.name, parsed.responsibilities);
      const response = await this.callLLM(servicePrompt);
      allFiles.push(...parsePromptOutput(response));
    }

    // 4. Package diagrams → Nest Modules
    for (const diagram of diagrams.packageDiagrams) {
      const parsed = parsePackageDiagram(JSON.parse(diagram.info));
      for (const mod of parsed.modules) {
        const modulePrompt = nestModulePrompt(mod.name, `Includes: ${mod.components.join(', ')}`);
        const response = await this.callLLM(modulePrompt);
        allFiles.push(...parsePromptOutput(response));
      }
    }

    // 5. Sequence diagrams → Angular Components
    for (const diagram of diagrams.sequenceDiagrams) {
      const parsed = parseSequenceDiagram(JSON.parse(diagram.info));
      const description = `Handles interaction between: ${parsed.messages.map(m => `${m.from} → ${m.to}: ${m.message}`).join(', ')}`;
      const componentPrompt = angularComponentPrompt(parsed.name, description);
      const response = await this.callLLM(componentPrompt);
      allFiles.push(...parsePromptOutput(response));
    }

    // Escribir archivos
    builder.writeFiles(allFiles);

    // Crear ZIP
    await zipGeneratedProject();

    // Retornar el buffer del zip
    return await this.getZipBuffer();
  }

  private async getZipBuffer(): Promise<Buffer> {
    const fs = await import('fs/promises');
    return fs.readFile('generated/project.zip');
  }

  private async callLLM(prompt: string): Promise<string> {
    // Simulación para pruebas (reemplaza por tu servicio real de LLM)
    // Por ejemplo: return await this.openaiService.complete(prompt);
    return `\`\`\`ts\n// example.ts\nconsole.log('Simulación LLM')\n\`\`\``;
  }
}
