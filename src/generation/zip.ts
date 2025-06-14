import * as archiver from 'archiver';
import * as fs from 'fs';
import * as path from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('ZipGenerator');

export async function zipGeneratedProject(): Promise<void> {
  return new Promise((resolve, reject) => {
    logger.log('Starting ZIP creation process...');
    
    // Ensure the output directory exists
    const outputDir = path.dirname('generated/project.zip');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      logger.log(`Created output directory: ${outputDir}`);
    }

    // Remove existing ZIP if it exists
    if (fs.existsSync('generated/project.zip')) {
      fs.unlinkSync('generated/project.zip');
      logger.log('Removed existing ZIP file');
    }

    const output = fs.createWriteStream('generated/project.zip');
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    output.on('close', () => {
      logger.log(`ZIP archive finalized. Size: ${archive.pointer()} bytes`);
      resolve();
    });

    output.on('end', () => {
      logger.log('Data has been drained');
    });

    archive.on('error', (err) => {
      logger.error('Error creating ZIP:', err);
      reject(err);
    });

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        logger.warn('Warning while creating ZIP:', err);
      } else {
        logger.error('Error in ZIP creation:', err);
        reject(err);
      }
    });

    archive.pipe(output);

    // Log directory contents before adding to ZIP
    logger.log('Current directory contents:');
    if (fs.existsSync('generated/nest')) {
      const nestFiles = fs.readdirSync('generated/nest', { recursive: true });
      logger.log('NestJS files:', nestFiles);
    }
    if (fs.existsSync('generated/angular')) {
      const angularFiles = fs.readdirSync('generated/angular', { recursive: true });
      logger.log('Angular files:', angularFiles);
    }

    // Add the entire generated directory contents with proper base
    if (fs.existsSync('generated/nest')) {
      archive.directory('generated/nest', 'nest');
      logger.log('Added NestJS directory to ZIP');
    } else {
      logger.warn('NestJS directory not found');
    }

    if (fs.existsSync('generated/angular')) {
      archive.directory('generated/angular', 'angular');
      logger.log('Added Angular directory to ZIP');
    } else {
      logger.warn('Angular directory not found');
    }

    // Add NestJS package.json and configuration files
    const nestPackageJson = {
      name: "nest-backend",
      version: "1.0.0",
      private: true,
      scripts: {
        "build": "nest build",
        "format": "prettier --write \"src/**/*.ts\"",
        "start": "nest start",
        "start:dev": "nest start --watch",
        "start:debug": "nest start --debug --watch",
        "start:prod": "node dist/main",
        "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
      },
      dependencies: {
        "@nestjs/common": "^10.0.0",
        "@nestjs/core": "^10.0.0",
        "@nestjs/platform-express": "^10.0.0",
        "@nestjs/typeorm": "^10.0.0",
        "class-transformer": "^0.5.1",
        "class-validator": "^0.14.0",
        "pg": "^8.11.0",
        "reflect-metadata": "^0.1.13",
        "rxjs": "^7.8.1",
        "typeorm": "^0.3.17"
      },
      devDependencies: {
        "@nestjs/cli": "^10.0.0",
        "@types/express": "^4.17.17",
        "@types/node": "^20.3.1",
        "@typescript-eslint/eslint-plugin": "^6.0.0",
        "@typescript-eslint/parser": "^6.0.0",
        "eslint": "^8.42.0",
        "prettier": "^3.0.0",
        "typescript": "^5.1.3"
      }
    };

    const nestTsConfig = {
      compilerOptions: {
        module: "commonjs",
        declaration: true,
        removeComments: true,
        emitDecoratorMetadata: true,
        experimentalDecorators: true,
        allowSyntheticDefaultImports: true,
        target: "ES2021",
        sourceMap: true,
        outDir: "./dist",
        baseUrl: "./",
        incremental: true,
        skipLibCheck: true,
        strictNullChecks: false,
        noImplicitAny: false,
        strictBindCallApply: false,
        forceConsistentCasingInFileNames: false,
        noFallthroughCasesInSwitch: false
      }
    };

    // Add Angular package.json and configuration files
    const angularPackageJson = {
      name: "angular-frontend",
      version: "1.0.0",
      private: true,
      scripts: {
        "ng": "ng",
        "start": "ng serve",
        "build": "ng build",
        "watch": "ng build --watch --configuration development",
        "test": "ng test"
      },
      dependencies: {
        "@angular/animations": "^17.0.0",
        "@angular/common": "^17.0.0",
        "@angular/compiler": "^17.0.0",
        "@angular/core": "^17.0.0",
        "@angular/forms": "^17.0.0",
        "@angular/platform-browser": "^17.0.0",
        "@angular/platform-browser-dynamic": "^17.0.0",
        "@angular/router": "^17.0.0",
        "rxjs": "~7.8.0",
        "tslib": "^2.3.0",
        "zone.js": "~0.14.2"
      },
      devDependencies: {
        "@angular-devkit/build-angular": "^17.0.0",
        "@angular/cli": "^17.0.0",
        "@angular/compiler-cli": "^17.0.0",
        "@types/jasmine": "~5.1.0",
        "jasmine-core": "~5.1.0",
        "karma": "~6.4.0",
        "karma-chrome-launcher": "~3.2.0",
        "karma-coverage": "~2.2.0",
        "karma-jasmine": "~5.1.0",
        "karma-jasmine-html-reporter": "~2.1.0",
        "typescript": "~5.2.2"
      }
    };

    const angularTsConfig = {
      compileOnSave: false,
      compilerOptions: {
        baseUrl: "./",
        outDir: "./dist/out-tsc",
        forceConsistentCasingInFileNames: true,
        strict: true,
        noImplicitOverride: true,
        noPropertyAccessFromIndexSignature: true,
        noImplicitReturns: true,
        noFallthroughCasesInSwitch: true,
        sourceMap: true,
        declaration: false,
        downlevelIteration: true,
        experimentalDecorators: true,
        moduleResolution: "node",
        importHelpers: true,
        target: "ES2022",
        module: "ES2022",
        useDefineForClassFields: false,
        lib: ["ES2022", "dom"]
      },
      angularCompilerOptions: {
        enableI18nLegacyMessageIdFormat: false,
        strictInjectionParameters: true,
        strictInputAccessModifiers: true,
        strictTemplates: true
      }
    };

    // Add configuration files
    archive.append(JSON.stringify(nestPackageJson, null, 2), { name: path.join('nest', 'package.json') });
    archive.append(JSON.stringify(nestTsConfig, null, 2), { name: path.join('nest', 'tsconfig.json') });
    archive.append(JSON.stringify(angularPackageJson, null, 2), { name: path.join('angular', 'package.json') });
    archive.append(JSON.stringify(angularTsConfig, null, 2), { name: path.join('angular', 'tsconfig.json') });
    logger.log('Added package.json and tsconfig.json files to ZIP');

    // Add root package.json
    const rootPackageJson = {
      name: "generated-project",
      version: "1.0.0",
      private: true,
      scripts: {
        "install:all": "cd nest && npm install && cd ../angular && npm install",
        "start:nest": "cd nest && npm run start",
        "start:angular": "cd angular && npm run start",
        "build:all": "cd nest && npm run build && cd ../angular && npm run build",
        "test:all": "cd nest && npm run test && cd ../angular && npm run test"
      }
    };

    archive.append(JSON.stringify(rootPackageJson, null, 2), { name: 'package.json' });
    logger.log('Added root package.json to ZIP');

    // Add README
    const readme = `# Generated Project

This project contains both NestJS backend and Angular frontend code generated from UML diagrams.

## Structure
- /nest - NestJS backend code
  - /src
    - /controllers - REST API controllers
    - /services - Business logic
    - /entities - Database models
    - /dtos - Data transfer objects
    - /modules - NestJS modules
- /angular - Angular frontend code
  - /src
    - /app
      - /components - Angular components
      - /services - Angular services
      - /models - TypeScript interfaces

## Getting Started

1. Install all dependencies:
   \`\`\`bash
   npm run install:all
   \`\`\`

2. Start the servers:
   - NestJS: \`npm run start:nest\`
   - Angular: \`npm run start:angular\`

3. Access the applications:
   - NestJS API: http://localhost:3000
   - Angular Frontend: http://localhost:4200

## Development

- Build both projects:
  \`\`\`bash
  npm run build:all
  \`\`\`

- Run tests:
  \`\`\`bash
  npm run test:all
  \`\`\`

## Project Structure

### NestJS Backend
- Controllers handle HTTP requests and define API endpoints
- Services contain business logic
- Entities define database models
- DTOs validate request/response data
- Modules organize and configure the application

### Angular Frontend
- Components handle UI elements and user interaction
- Services manage data and communicate with the backend
- Models define TypeScript interfaces for type safety
`;

    archive.append(readme, { name: 'README.md' });
    logger.log('Added README.md to ZIP');

    // Finalize the archive
    archive.finalize();
    logger.log('Finalizing ZIP archive...');
  });
}

