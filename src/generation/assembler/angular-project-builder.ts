import * as fs from 'fs/promises';
import * as path from 'path';
import { Logger } from '@nestjs/common';
import { GeneratedFile } from './types';

export class AngularProjectBuilder {
  private readonly logger = new Logger('AngularProjectBuilder');
  private readonly angularDir = path.join('generated', 'angular');

  async writeFiles(files: GeneratedFile[]) {
    const angularFiles = files.filter(f => this.isAngularFile(f));
    if (!angularFiles.length) return;

    await this.ensureDirectories();
    await this.createPackageJson();

    for (const file of angularFiles) {
      const fullPath = path.join(this.angularDir, file.path);
      await fs.mkdir(path.dirname(fullPath), { recursive: true });
      await fs.writeFile(fullPath, file.content);
      this.logger.log(`Wrote Angular file: ${fullPath}`);
    }
  }

  private isAngularFile(file: GeneratedFile): boolean {
    return file.path.startsWith('src/app/components') ||
           file.path.startsWith('src/app/services') ||
           file.path.startsWith('src/app/models') ||
           file.path.startsWith('src/app');
  }

  private async ensureDirectories() {
    await fs.mkdir(this.angularDir, { recursive: true });
    await fs.mkdir(path.join(this.angularDir, 'src'), { recursive: true });
  }

  private async createPackageJson() {
    const pkg = {
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
    await fs.writeFile(path.join(this.angularDir, 'package.json'), JSON.stringify(pkg, null, 2));
  }
}
