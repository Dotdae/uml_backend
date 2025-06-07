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
  const nodes = json.nodes || [];
  const connections = json.connections || [];

  const actorNode = nodes.find((node: any) => node.type === 'actor');
  const entityName = actorNode?.data?.label || 'Default';

  const actions: UsecaseAction[] = connections.map((conn: any) => {
    const text = conn.message?.toLowerCase() || '';
    let method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';

    if (text.includes('create') || text.includes('add')) method = 'POST';
    else if (text.includes('update') || text.includes('modify')) method = 'PUT';
    else if (text.includes('delete') || text.includes('remove')) method = 'DELETE';

    return {
      name: conn.message || 'action',
      method,
      path: `/${entityName.toLowerCase()}`,
      description: conn.message || 'auto-generated'
    };
  });

  return {
    usecaseName: json.name || 'UseCaseDiagram',
    entity: entityName,
    actions
  };
}
