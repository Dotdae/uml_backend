import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { GeneratedFile } from './types';

export class NestProjectBuilder {
  private readonly logger = new Logger('NestProjectBuilder');
  private readonly nestDir = path.join('generated', 'nest');

  async writeFiles(files: GeneratedFile[]) {
    const nestFiles = files.filter(f => this.isNestFile(f));
    if (!nestFiles.length) return;

    await this.ensureDirectories();
    await this.createPackageJson();

    for (const file of nestFiles) {
      const fullPath = path.join(this.nestDir, file.path);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.content);
      this.logger.log(`Wrote NestJS file: ${fullPath}`);
    }
  }

  private isNestFile(file: GeneratedFile): boolean {
    return file.path.startsWith('src/entities') ||
           file.path.startsWith('src/controllers') ||
           file.path.startsWith('src/services') ||
           file.path.startsWith('src/modules') ||
           file.path.startsWith('src/dtos') ||
           file.path === 'src/main.ts' ||
           file.path === 'src/app.module.ts';
  }

  private async ensureDirectories() {
    await fs.mkdir(this.nestDir, { recursive: true });
    await fs.mkdir(path.join(this.nestDir, 'src'), { recursive: true });
  }

  private async createPackageJson() {
    const pkg = {
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
        "eslint": "^8.42.0",
        "prettier": "^3.0.0",
        "typescript": "^5.1.3"
      }
    };
    await fs.writeFile(path.join(this.nestDir, 'package.json'), JSON.stringify(pkg, null, 2));
  }
}
