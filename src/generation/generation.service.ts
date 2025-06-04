import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { GeminiService } from './gemini/gemini.service';

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
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class GenerationService {
  private readonly logger = new Logger(GenerationService.name);

  constructor(
    private readonly projectsService: ProjectsService,
    private readonly geminiService: GeminiService
  ) {}

  async generateFullProject(projectId: number): Promise<Buffer> {
    this.logger.log(`Starting code generation for project ${projectId}`);
    
    try {
      const diagrams = await this.projectsService.getProjectDiagramsGrouped(projectId);
      this.logger.log(`Found diagrams: 
        Class: ${diagrams.classDiagrams?.length || 0},
        Sequence: ${diagrams.sequenceDiagrams?.length || 0},
        Component: ${diagrams.componentDiagrams?.length || 0},
        Package: ${diagrams.packageDiagrams?.length || 0},
        UseCase: ${diagrams.usecaseDiagrams?.length || 0}
      `);

      const builder = new ProjectBuilder();
      let allFiles = [];

      // 1. Class diagrams → Entities
      this.logger.log('Processing class diagrams...');
      for (const diagram of diagrams.classDiagrams || []) {
        try {
          this.logger.debug(`Parsing class diagram: ${JSON.stringify(diagram.info)}`);
          const parsedClasses = parseClassDiagram(JSON.parse(diagram.info));
          this.logger.log(`Found ${parsedClasses.length} classes in diagram`);
          
          for (const parsed of parsedClasses) {
            this.logger.log(`Generating entity for class: ${parsed.name}`);
            const fields = parsed.fields.map(f =>
              `${f.name}: ${f.type}${f.nullable ? ' (nullable)' : ''}${f.primary ? ' (primary)' : ''} - ${f.visibility}`
            ).join('\n');

            const entityPrompt = nestEntityPrompt(parsed.name, fields);
            this.logger.debug(`Sending prompt to LLM for ${parsed.name}`);
            const response = await this.callLLM(entityPrompt);
            this.logger.debug(`Received response from LLM for ${parsed.name}`);
            
            const parsedFiles = parsePromptOutput(response);
            this.logger.log(`Generated ${parsedFiles.length} files for class ${parsed.name}`);
            allFiles.push(...parsedFiles);
          }
        } catch (error) {
          this.logger.error(`Error processing class diagram: ${error.message}`, error.stack);
          throw error;
        }
      }

      // 2. Use case diagrams → Controller + Service + DTOs
      this.logger.log('Processing use case diagrams...');
      for (const diagram of diagrams.usecaseDiagrams || []) {
        try {
          const diagramInfo = JSON.parse(diagram.info);
          this.logger.debug(`Parsing use case diagram: ${JSON.stringify(diagramInfo)}`);
          
          const parsed = parseUsecaseDiagram(diagramInfo);
          if (!parsed.actions || parsed.actions.length === 0) {
            this.logger.warn(`No actions found in use case diagram, skipping...`);
            continue;
          }

          this.logger.log(`Generating controller for entity: ${parsed.entity}`);
          
          const actions = parsed.actions.map(a =>
            `${a.method} ${a.path} - ${a.name}: ${a.description || ''}`
          ).join('\n');

          const controllerPrompt = nestControllerPrompt(parsed.entity, actions);
          const response = await this.callLLM(controllerPrompt);
          const parsedFiles = parsePromptOutput(response);
          this.logger.log(`Generated ${parsedFiles.length} files for use case ${parsed.entity}`);
          allFiles.push(...parsedFiles);
        } catch (error) {
          this.logger.error(`Error processing use case diagram: ${error.message}`, error.stack);
          // Continue with other diagrams instead of failing completely
          continue;
        }
      }

      // 3. Component diagrams → Angular Services
      this.logger.log('Processing component diagrams...');
      for (const diagram of diagrams.componentDiagrams || []) {
        try {
          const parsed = parseComponentDiagram(JSON.parse(diagram.info));
          this.logger.log(`Generating service for component: ${parsed.name}`);
          
          const servicePrompt = angularServicePrompt(parsed.name, parsed.responsibilities);
          const response = await this.callLLM(servicePrompt);
          const parsedFiles = parsePromptOutput(response);
          this.logger.log(`Generated ${parsedFiles.length} files for component ${parsed.name}`);
          allFiles.push(...parsedFiles);
        } catch (error) {
          this.logger.error(`Error processing component diagram: ${error.message}`, error.stack);
          throw error;
        }
      }

      // 4. Package diagrams → Nest Modules
      this.logger.log('Processing package diagrams...');
      for (const diagram of diagrams.packageDiagrams || []) {
        try {
          const diagramInfo = JSON.parse(diagram.info);
          this.logger.debug(`Parsing package diagram: ${JSON.stringify(diagramInfo)}`);
          
          const parsed = parsePackageDiagram(diagramInfo);
          if (!parsed.modules || parsed.modules.length === 0) {
            this.logger.warn(`No modules found in package diagram, skipping...`);
            continue;
          }

          for (const mod of parsed.modules) {
            this.logger.log(`Generating module: ${mod.name}`);
            const components = mod.components?.length > 0 
              ? `Includes: ${mod.components.join(', ')}`
              : 'No components specified';
            const dependencies = mod.dependencies?.length > 0
              ? `Dependencies: ${mod.dependencies.join(', ')}`
              : 'No dependencies';
              
            const modulePrompt = nestModulePrompt(
              mod.name, 
              `${components}\n${dependencies}`
            );
            const response = await this.callLLM(modulePrompt);
            const parsedFiles = parsePromptOutput(response);
            this.logger.log(`Generated ${parsedFiles.length} files for module ${mod.name}`);
            allFiles.push(...parsedFiles);
          }
        } catch (error) {
          this.logger.error(`Error processing package diagram: ${error.message}`, error.stack);
          // Continue with other diagrams instead of failing completely
          continue;
        }
      }

      // 5. Sequence diagrams → Angular Components
      this.logger.log('Processing sequence diagrams...');
      for (const diagram of diagrams.sequenceDiagrams || []) {
        try {
          const diagramInfo = JSON.parse(diagram.info);
          this.logger.debug(`Parsing sequence diagram: ${JSON.stringify(diagramInfo)}`);
          
          const parsed = parseSequenceDiagram(diagramInfo);
          if (!parsed.messages || parsed.messages.length === 0) {
            this.logger.warn(`No messages found in sequence diagram, skipping...`);
            continue;
          }

          this.logger.log(`Generating component for sequence: ${parsed.name}`);
          
          const description = parsed.messages.map(m => 
            `${m.from} → ${m.to}: ${m.message} (${m.type})`
          ).join('\n');
          
          const componentPrompt = angularComponentPrompt(
            parsed.name, 
            `Main actor: ${parsed.actor}\nInteractions:\n${description}`
          );
          const response = await this.callLLM(componentPrompt);
          const parsedFiles = parsePromptOutput(response);
          this.logger.log(`Generated ${parsedFiles.length} files for sequence ${parsed.name}`);
          allFiles.push(...parsedFiles);
        } catch (error) {
          this.logger.error(`Error processing sequence diagram: ${error.message}`, error.stack);
          // Continue with other diagrams instead of failing completely
          continue;
        }
      }

      // Write all generated files first
      this.logger.log(`Writing ${allFiles.length} generated files...`);
      await builder.writeFiles(allFiles);

      // Create the ZIP file after all files are written
      this.logger.log('Creating ZIP file...');
      try {
        await zipGeneratedProject();
        this.logger.log('ZIP file created successfully');

        // Read and return the ZIP buffer
        this.logger.log('Reading ZIP buffer...');
        const fs = await import('fs/promises');
        const buffer = await fs.readFile('generated/project.zip');
        
        // Verify ZIP file size
        const stats = await fs.stat('generated/project.zip');
        this.logger.log(`ZIP file size: ${stats.size} bytes`);
        
        if (stats.size === 0) {
          throw new Error('Generated ZIP file is empty');
        }
        
        this.logger.log('Generation completed successfully!');
        return buffer;
      } catch (error) {
        this.logger.error(`Error creating ZIP file: ${error.message}`, error.stack);
        throw new Error(`Failed to create ZIP file: ${error.message}`);
      }
    } catch (error) {
      this.logger.error(`Error in code generation: ${error.message}`, error.stack);
      throw error;
    }
  }

  private async callLLM(prompt: string): Promise<string> {
    this.logger.debug('Calling LLM with prompt:', prompt);
    try {
      const response = await this.geminiService.generateCode(prompt);
      this.logger.debug('Received response from LLM');
      return response;
    } catch (error) {
      this.logger.error(`Error calling LLM: ${error.message}`, error.stack);
      throw error;
    }
  }
}
