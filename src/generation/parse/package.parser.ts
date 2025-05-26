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
  // Validate input
  if (!json || typeof json !== 'object') {
    throw new Error('Invalid package diagram: Input must be a valid JSON object');
  }

  const modules: PackageModule[] = [];

  // Extract modules from nodeDataArray if available
  if (json.nodeDataArray && Array.isArray(json.nodeDataArray)) {
    // Filter for package nodes
    const packageNodes = json.nodeDataArray.filter((node: any) => 
      node.category === 'Package' || 
      (node.text && typeof node.text === 'string')
    );

    // Convert nodes to modules
    modules.push(...packageNodes.map((node: any) => ({
      name: node.text || node.name || 'Unnamed Module',
      components: [], // Will be populated from relationships
      dependencies: []
    })));

    // Find components within each module using group property
    json.nodeDataArray.forEach((node: any) => {
      if (node.group) {
        const parentModule = modules.find(m => 
          m.name === (
            packageNodes.find(p => p.key === node.group)?.text || 
            packageNodes.find(p => p.key === node.group)?.name
          )
        );
        if (parentModule) {
          parentModule.components.push(node.text || node.name || 'Unnamed Component');
        }
      }
    });
  }

  // Extract dependencies from linkDataArray if available
  if (json.linkDataArray && Array.isArray(json.linkDataArray)) {
    json.linkDataArray.forEach((link: any) => {
      if (link.from && link.to) {
        // Find source and target modules
        const fromNode = json.nodeDataArray?.find((n: any) => n.key === link.from);
        const toNode = json.nodeDataArray?.find((n: any) => n.key === link.to);
        
        if (fromNode && toNode) {
          const sourceModule = modules.find(m => m.name === (fromNode.text || fromNode.name));
          const targetModule = modules.find(m => m.name === (toNode.text || toNode.name));
          
          if (sourceModule && targetModule) {
            if (!sourceModule.dependencies) {
              sourceModule.dependencies = [];
            }
            sourceModule.dependencies.push(targetModule.name);
          }
        }
      }
    });
  }

  // Ensure at least one default module if none found
  if (modules.length === 0) {
    modules.push({
      name: 'DefaultModule',
      components: ['DefaultComponent'],
      dependencies: []
    });
  }

  return {
    name: json.name || json.class || 'Default Package',
    modules
  };
}
