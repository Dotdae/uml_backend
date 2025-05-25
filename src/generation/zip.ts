import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';


export async function zipGeneratedProject(outputPath = 'generated/project.zip'): Promise<Buffer> {
  const basePath = 'generated';
  const angularPath = path.join(basePath, 'angular');
  const nestPath = path.join(basePath, 'nest');

  if (!fs.existsSync(angularPath) || !fs.existsSync(nestPath)) {
    throw new Error('Angular or Nest build folders not found. Make sure they are generated first.');
  }

  const zipOutput = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    zipOutput.on('close', () => {
      // ✅ Leer el archivo zip como Buffer y resolverlo
      const zipBuffer = fs.readFileSync(outputPath);
      resolve(zipBuffer);
    });

    zipOutput.on('error', (err) => {
      reject(err);
    });

    archive.pipe(zipOutput);
    archive.directory(angularPath, 'angular');
    archive.directory(nestPath, 'nest');
    archive.finalize();
  });
}

