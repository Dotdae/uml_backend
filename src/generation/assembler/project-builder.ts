import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from '@nestjs/common';

interface GeneratedFile {
  path: string;
  content: string;
}

export class ProjectBuilder {
  private readonly logger = new Logger('ProjectBuilder');
  private readonly baseDir = 'generated';
  private readonly nestDir = path.join(this.baseDir, 'nest');
  private readonly angularDir = path.join(this.baseDir, 'angular');

  async writeFiles(files: GeneratedFile[]) {
    try {
      this.logger.log(`Starting to write ${files.length} files...`);

      // Clean and prepare directories
      await this.cleanDirectories();
      await this.ensureDirectories();
      await this.createPackageJsonFiles();

      for (const file of files) {
        try {
          const category = this.classifyFile(file);
          const basePath = category === 'nest' ? this.nestDir
                          : category === 'angular' ? this.angularDir
                          : this.baseDir;
          const fullPath = path.join(basePath, file.path);
          const dir = path.dirname(fullPath);

          // Warn if imports seem incorrect
          this.checkForInvalidImports(file, category);

          await fs.mkdir(dir, { recursive: true, mode: 0o755 });
          await fs.writeFile(fullPath, file.content, { mode: 0o644 });
          this.logger.log(`Created file: ${fullPath}`);

        } catch (error) {
          this.logger.error(`Error writing file ${file.path}: ${error.message}`);
          throw error;
        }
      }

      await this.verifyDirectories();
    } catch (error) {
      this.logger.error(`Error writing files: ${error.message}`);
      throw error;
    }
  }

  private classifyFile(file: GeneratedFile): 'nest' | 'angular' | 'unknown' {
    if (
      file.path.startsWith('src/entities') ||
      file.path.startsWith('src/controllers') ||
      file.path.startsWith('src/services') ||
      file.path.startsWith('src/modules') ||
      file.path.startsWith('src/dtos')
    ) {
      return 'nest';
    }

    if (
      file.path.startsWith('src/app/components') ||
      file.path.startsWith('src/app/services') ||
      file.path.startsWith('src/app/models')
    ) {
      return 'angular';
    }

    return 'unknown';
  }

  private checkForInvalidImports(file: GeneratedFile, category: 'nest' | 'angular' | 'unknown') {
    if (category === 'nest') {
      if (file.content.includes('@angular/core')) {
        this.logger.warn(`⚠️ Angular import detected in NestJS file: ${file.path}`);
      }
    }

    if (category === 'angular') {
      if (file.content.includes('@nestjs/common') || file.content.includes('@nestjs/core')) {
        this.logger.warn(`⚠️ NestJS import detected in Angular file: ${file.path}`);
      }
    }
  }

  private async cleanDirectories() {
    try {
      await fs.rm(this.baseDir, { recursive: true, force: true });
      this.logger.log('Cleaned existing directories');
    } catch (error) {
      if (error.code !== 'ENOENT') {
        this.logger.error(`Error cleaning directories: ${error.message}`);
        throw error;
      }
    }
  }

  private async ensureDirectories() {
    try {
      await fs.mkdir(this.nestDir, { recursive: true, mode: 0o755 });
      await fs.mkdir(path.join(this.nestDir, 'src/entities'), { recursive: true });
      await fs.mkdir(path.join(this.nestDir, 'src/controllers'), { recursive: true });
      await fs.mkdir(path.join(this.nestDir, 'src/services'), { recursive: true });
      await fs.mkdir(path.join(this.nestDir, 'src/modules'), { recursive: true });
      await fs.mkdir(path.join(this.nestDir, 'src/dtos'), { recursive: true });

      await fs.mkdir(this.angularDir, { recursive: true, mode: 0o755 });
      await fs.mkdir(path.join(this.angularDir, 'src/app/components'), { recursive: true });
      await fs.mkdir(path.join(this.angularDir, 'src/app/services'), { recursive: true });
      await fs.mkdir(path.join(this.angularDir, 'src/app/models'), { recursive: true });

      this.logger.log('Created directory structure');
    } catch (error) {
      this.logger.error(`Error creating directories: ${error.message}`);
      throw error;
    }
  }

  private async createPackageJsonFiles() {
    const nestPackageJson = {
      name: "nest-backend",
      version: "1.0.0",
      private: true,
      scripts: {
        build: "nest build",
        format: "prettier --write \"src/**/*.ts\"",
        start: "nest start",
        "start:dev": "nest start --watch",
        "start:debug": "nest start --debug --watch",
        "start:prod": "node dist/main",
        lint: "eslint \"{src,apps,libs,test}/**/*.ts\" --fix"
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
        eslint: "^8.42.0",
        prettier: "^3.0.0",
        typescript: "^5.1.3"
      }
    };

    const angularPackageJson = {
      name: "angular-frontend",
      version: "1.0.0",
      private: true,
      scripts: {
        ng: "ng",
        start: "ng serve",
        build: "ng build",
        watch: "ng build --watch --configuration development",
        test: "ng test"
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
        rxjs: "~7.8.0",
        tslib: "^2.3.0",
        "zone.js": "~0.14.2"
      },
      devDependencies: {
        "@angular-devkit/build-angular": "^17.0.0",
        "@angular/cli": "^17.0.0",
        "@angular/compiler-cli": "^17.0.0",
        "@types/jasmine": "~5.1.0",
        "jasmine-core": "~5.1.0",
        karma: "~6.4.0",
        "karma-chrome-launcher": "~3.2.0",
        "karma-coverage": "~2.2.0",
        "karma-jasmine": "~5.1.0",
        "karma-jasmine-html-reporter": "~2.1.0",
        typescript: "~5.2.2"
      }
    };

    const nestPath = path.join(this.nestDir, 'package.json');
    const angularPath = path.join(this.angularDir, 'package.json');

    await fs.writeFile(nestPath, JSON.stringify(nestPackageJson, null, 2), { mode: 0o644 });
    this.logger.log(`Created NestJS package.json at ${nestPath}`);

    await fs.writeFile(angularPath, JSON.stringify(angularPackageJson, null, 2), { mode: 0o644 });
    this.logger.log(`Created Angular package.json at ${angularPath}`);
  }

  private async verifyDirectories() {
    try {
      this.logger.log('Verifying directory contents...');

      const nestFiles = await fs.readdir(this.nestDir, { recursive: true });
      this.logger.log(`NestJS files: ${JSON.stringify(nestFiles, null, 2)}`);

      const angularFiles = await fs.readdir(this.angularDir, { recursive: true });
      this.logger.log(`Angular files: ${JSON.stringify(angularFiles, null, 2)}`);
    } catch (error) {
      this.logger.error(`Error verifying directories: ${error.message}`);
      throw error;
    }
  }
}
