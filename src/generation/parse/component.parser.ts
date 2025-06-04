export interface ParsedComponentDiagram {
  name: string;
  responsibilities: string;
  dependencies?: string[];
}

export function parseComponentDiagram(json: any): ParsedComponentDiagram {
  const component = (json.nodes || []).find((n: any) => n.type === 'component');

  return {
    name: component?.data.label || 'Component',
    responsibilities: 'Responsibilities not defined',
    dependencies: (json.connections || []).map((c: any) => c.label || 'dependency')
  };
}