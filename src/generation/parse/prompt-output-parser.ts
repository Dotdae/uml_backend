import { Logger } from '@nestjs/common';
import * as path from 'path';

interface GeneratedFile {
  path: string;
  content: string;
}

const logger = new Logger('PromptOutputParser');

function inferFilePath(code: string, defaultPath: string): string {
  // Try to find filename in first line comment
  const firstLine = code.split('\n')[0];
  if (firstLine.includes('//') && firstLine.includes('.')) {
    const match = firstLine.match(/\/\/\s*([\w\/-]+\.[a-zA-Z]+)/);
    if (match) {
      logger.debug(`Found file path in comment: ${match[1]}`);
      // Remove any leading src/ from the path
      return match[1].replace(/^src\//, '');
    }
  }

  // Try to find class or interface name
  const classMatch = code.match(/export\s+(?:class|interface)\s+(\w+)/);
  if (classMatch) {
    const name = classMatch[1];
    // Convert PascalCase to kebab-case
    const kebabName = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    
    let inferredPath = '';
    if (code.includes('@Controller')) {
      inferredPath = path.join('controllers', `${kebabName}.controller.ts`);
    } else if (code.includes('@Injectable')) {
      inferredPath = path.join('services', `${kebabName}.service.ts`);
    } else if (code.includes('@Entity')) {
      inferredPath = path.join('entities', `${kebabName}.entity.ts`);
    } else if (code.includes('@Component')) {
      inferredPath = path.join('app', 'components', kebabName, `${kebabName}.component.ts`);
    } else {
      inferredPath = defaultPath;
    }
    logger.debug(`Inferred file path from class name: ${inferredPath}`);
    return inferredPath;
  }

  logger.debug(`Using default path: ${defaultPath}`);
  return defaultPath;
}

export function parsePromptOutput(output: string): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  logger.debug('Starting to parse prompt output');

  // Match code blocks with or without language and path specifications
  const codeBlockRegex = /```(?:(\w+)\s*(?:\n|$)|\s*(?:\n|$))([\s\S]*?)```/g;
  let match;

  while ((match = codeBlockRegex.exec(output)) !== null) {
    const [_, lang, code] = match;
    const trimmedCode = code.trim();
    
    if (!trimmedCode) {
      logger.debug('Empty code block found, skipping');
      continue;
    }

    // Determine file path and add to files array
    let filePath: string;
    if (trimmedCode.startsWith('// ') && trimmedCode.split('\n')[0].includes('.')) {
      // Extract path from first line comment
      filePath = trimmedCode.split('\n')[0].replace('//', '').trim();
      // Remove any leading src/ from the path
      filePath = filePath.replace(/^src\//, '');
      logger.debug(`Found file path in comment: ${filePath}`);
    } else {
      // Infer path based on content
      const defaultPath = lang === 'html' ? 'index.html' : `file.${lang || 'ts'}`;
      filePath = inferFilePath(trimmedCode, defaultPath);
      logger.debug(`Inferred file path: ${filePath}`);
    }

    // Determine if this is a NestJS or Angular file
    const isNestFile = filePath.includes('controller') || 
                      filePath.includes('service') || 
                      filePath.includes('entity') || 
                      filePath.includes('dto') || 
                      filePath.includes('module');

    // Add the appropriate prefix to the path
    const finalPath = isNestFile ? 
      path.join('nest', 'src', filePath) : 
      path.join('angular', 'src', filePath);

    files.push({
      path: finalPath,
      content: trimmedCode
    });

    logger.debug(`Added file: ${finalPath}`);
  }

  logger.log(`Parsed ${files.length} files from prompt output`);
  return files;
}
