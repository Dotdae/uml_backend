export interface ParsedComponent {
  name: string;
  responsibilities: string;
  dependencies?: string[];
}

export interface ParsedComponentDiagram {
  components: ParsedComponent[];
}

export function parseComponentDiagram(json: any): ParsedComponentDiagram {
  const components = (json.nodes || [])
    .filter((n: any) => n.type === 'component')
    .map((component: any) => {
      const componentId = component.id;
      const dependencies = (json.connections || [])
        .filter((c: any) => c.source === componentId)
        .map((c: any) => c.target);

      return {
        name: component?.data?.label || 'Component',
        responsibilities: 'Responsibilities not defined',
        dependencies,
      };
    });

  return { components };
}
