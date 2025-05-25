import * as fs from 'fs';
import * as path from 'path';

export interface FileSpec {
  filename: string;
  content: string;
  location: 'angular' | 'nest';
  relativePath: string; // relative to root of project (e.g. 'src/app/components/example/example.component.ts')
}

export class ProjectBuilder {
  private angularRoot = 'generated/angular';
  private nestRoot = 'generated/nest';

  constructor(private basePath = 'generated') {
    this.cleanBuild();
  }

  private cleanBuild() {
    if (fs.existsSync(this.basePath)) {
      fs.rmSync(this.basePath, { recursive: true, force: true });
    }
    fs.mkdirSync(this.angularRoot, { recursive: true });
    fs.mkdirSync(this.nestRoot, { recursive: true });
  }

  public writeFiles(files: FileSpec[]) {
    for (const file of files) {
      const targetRoot = file.location === 'angular' ? this.angularRoot : this.nestRoot;
      const fullPath = path.join(targetRoot, file.relativePath);
      const dir = path.dirname(fullPath);

      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(fullPath, file.content);
    }
  }

  public getBuildPaths() {
    return {
      angular: this.angularRoot,
      nest: this.nestRoot,
      base: this.basePath,
    };
  }
}