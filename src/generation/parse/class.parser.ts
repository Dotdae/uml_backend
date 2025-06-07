interface UMLAttribute {
  name: string;
  type: string;
  primary?: boolean;
  nullable?: boolean;
  visibility?: string;
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

function parsePropertyString(prop: string): UMLAttribute {
  const match = prop.match(/^([\-\+\#])\s*(\w+)\s*:\s*(\w+)$/);
  if (!match) {
    return {
      name: 'invalid',
      type: 'string',
      visibility: 'private'
    };
  }
  const [_, visibility, name, type] = match;
  return {
    name,
    type: type.toLowerCase(),
    visibility: visibility === '+' ? 'public' : visibility === '#' ? 'protected' : 'private',
    nullable: true
  };
}

function determineRelationType(text: string, fromText: string, toText: string): string {
  if (text === 'herencia') return 'ManyToOne';
  if (fromText === '1' && toText === '0..n') return 'OneToMany';
  if (fromText === '1' && toText === '1..n') return 'OneToMany';
  if (fromText === '1' && toText === '1') return 'OneToOne';
  return 'ManyToMany';
}

export function parseClassDiagram(json: any): ParsedClassDiagram[] {
  const diagrams: ParsedClassDiagram[] = [];

  for (const node of json.nodes || []) {
    if (node.type !== 'class') continue;

    const fields: UMLAttribute[] = [];
    const relations: UMLRelation[] = [];
    const props = node.data.properties || [];

    for (const prop of props) {
      fields.push(parsePropertyString(prop));
    }

    diagrams.push({
      name: node.data.label.replace('<<Interface>>', '').trim(),
      fields,
      relations
    });
  }

  for (const link of json.connections || []) {
    const source = json.nodes.find((n: any) => n.id === link.source);
    const target = json.nodes.find((n: any) => n.id === link.target);
    if (!source || !target) continue;

    const classIndex = diagrams.findIndex(d => d.name === source.data.label);
    if (classIndex === -1) continue;

    diagrams[classIndex].relations.push({
      type: determineRelationType(link.type, '1', '*') as any,
      target: target.data.label,
      field: link.label?.toLowerCase() || 'relation'
    });
  }

  return diagrams;
}