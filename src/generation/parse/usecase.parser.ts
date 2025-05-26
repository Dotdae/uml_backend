interface UsecaseAction {
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  input?: any;
  output?: any;
  description?: string;
}

export interface ParsedUsecaseDiagram {
  usecaseName: string;
  entity: string;
  actions: UsecaseAction[];
}

export function parseUsecaseDiagram(json: any): ParsedUsecaseDiagram {
  // Validate input
  if (!json || typeof json !== 'object') {
    throw new Error('Invalid use case diagram: Input must be a valid JSON object');
  }

  // Extract entity name from nodeDataArray if available
  let entityName = '';
  if (json.nodeDataArray && Array.isArray(json.nodeDataArray)) {
    const actorNode = json.nodeDataArray.find((node: any) => node.category === 'Actor');
    if (actorNode) {
      entityName = actorNode.name;
    }
  }

  // Extract actions from linkDataArray if available
  let actions: UsecaseAction[] = [];
  if (json.linkDataArray && Array.isArray(json.linkDataArray)) {
    actions = json.linkDataArray
      .filter((link: any) => link.text && link.from && link.to)
      .map((link: any) => {
        // Try to determine HTTP method from the action text
        let method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';
        const text = link.text.toLowerCase();
        if (text.includes('create') || text.includes('add') || text.includes('save')) {
          method = 'POST';
        } else if (text.includes('update') || text.includes('modify')) {
          method = 'PUT';
        } else if (text.includes('delete') || text.includes('remove')) {
          method = 'DELETE';
        }

        return {
          name: link.text,
          method,
          path: `/${entityName.toLowerCase()}`,
          description: link.description || link.text
        };
      });
  }

  return {
    usecaseName: json.name || 'Untitled Use Case',
    entity: entityName || 'Default',
    actions: actions
  };
}
