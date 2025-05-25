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
  return {
    usecaseName: json.name,
    entity: json.entity,
    actions: json.actions.map((action: any) => ({
      name: action.name,
      method: action.method,
      path: action.path,
      input: action.input,
      output: action.output,
      description: action.description,
    })),
  };
}
