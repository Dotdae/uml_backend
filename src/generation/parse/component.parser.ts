export interface ParsedComponentDiagram {
  name: string;
  responsibilities: string;
  dependencies?: string[];
}

export function parseComponentDiagram(json: any): ParsedComponentDiagram {
  return {
    name: json.name,
    responsibilities: json.description,
    dependencies: json.dependencies || [],
  };
}