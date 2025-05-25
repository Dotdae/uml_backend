interface UMLAttribute {
  name: string;
  type: string;
  primary?: boolean;
  nullable?: boolean;
}

interface UMLRelation {
  type: 'OneToMany' | 'ManyToOne' | 'OneToOne' | 'ManyToMany';
  target: string;
  field: string;
}

export interface ParsedClassDiagram {
  name: string;
  fields: UMLAttribute[];
  relations: UMLRelation[];
}

export function parseClassDiagram(json: any): ParsedClassDiagram {
  return {
    name: json.name,
    fields: json.attributes.map((attr: any) => ({
      name: attr.name,
      type: attr.type,
      primary: attr.primary || false,
      nullable: attr.nullable ?? true,
    })),
    relations: json.relationships?.map((rel: any) => ({
      type: rel.type,
      target: rel.target,
      field: rel.field,
    })) || [],
  };
}
