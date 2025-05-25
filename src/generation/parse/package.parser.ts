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
  return {
    name: json.name,
    modules: json.modules.map((mod: any) => ({
      name: mod.name,
      components: mod.components,
      dependencies: mod.dependencies || [],
    })),
  };
}
