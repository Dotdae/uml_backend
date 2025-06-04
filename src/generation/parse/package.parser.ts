interface PackageModule {
  name: string;
  components: string[];
  dependencies?: string[];
}

export interface ParsedPackageDiagram {
  name: string;
  modules: PackageModule[];
}

export function parsePackageDiagram(json: any): ParsedPackageDiagram {
  const modules: PackageModule[] = [];

  const packageNodes = (json.nodes || []).filter((n: any) => n.type === 'package');
  modules.push(...packageNodes.map((n: any) => ({
    name: n.data.label,
    components: [],
    dependencies: []
  })));

  for (const conn of json.connections || []) {
    const from = json.nodes.find((n: any) => n.id === conn.source);
    const to = json.nodes.find((n: any) => n.id === conn.target);

    const fromMod = modules.find(m => m.name === from?.data.label);
    const toMod = modules.find(m => m.name === to?.data.label);

    if (fromMod && toMod) {
      fromMod.dependencies?.push(toMod.name);
    }
  }

  return {
    name: json.name || 'PackageDiagram',
    modules
  };
}
