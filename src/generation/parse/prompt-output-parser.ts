export interface FileSpec {
  filename: string;
  content: string;
  location: 'angular' | 'nest';
  relativePath: string;
}

export function parsePromptOutput(response: string): FileSpec[] {
  const files: FileSpec[] = [];

  const regex = /```(?:\w*\n)?(?:(\/\/|#)\s*)?([\w\-/.]+)\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(response)) !== null) {
    const filename = match[2].trim();
    const content = match[3].trim();

    const extension = filename.split('.').pop() || '';
    const location: 'angular' | 'nest' =
      ['component.ts', 'service.ts', 'html', 'scss'].some((ext) => filename.includes(ext))
        ? 'angular'
        : 'nest';

    files.push({
      filename,
      content,
      location,
      relativePath: determineRelativePath(filename),
    });
  }

  return files;
}

function determineRelativePath(filename: string): string {
  if (filename.endsWith('.component.ts')) {
    const name = filename.replace('.component.ts', '');
    return `src/app/components/${name}/${filename}`;
  } else if (filename.endsWith('.component.html')) {
    const name = filename.replace('.component.html', '');
    return `src/app/components/${name}/${filename}`;
  } else if (filename.endsWith('.component.scss')) {
    const name = filename.replace('.component.scss', '');
    return `src/app/components/${name}/${filename}`;
  } else if (filename.endsWith('.service.ts')) {
    return `src/app/services/${filename}`;
  } else if (filename.endsWith('.module.ts')) {
    return `src/${filename}`;
  } else if (filename.endsWith('.controller.ts') || filename.endsWith('.service.ts')) {
    return `src/${filename}`;
  } else {
    return `src/${filename}`; // default fallback
  }
}
