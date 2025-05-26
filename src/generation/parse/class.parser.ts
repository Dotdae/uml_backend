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
  // Example format: "- nombre: String" or "+ edad: int"
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
  if (text === 'herencia') {
    return 'ManyToOne';
  }
  
  if (fromText === '1' && toText === '0..n') {
    return 'OneToMany';
  }
  
  if (fromText === '1' && toText === '1..n') {
    return 'OneToMany';
  }
  
  if (fromText === '1' && toText === '1') {
    return 'OneToOne';
  }
  
  return 'ManyToMany';
}

export function parseClassDiagram(json: any): ParsedClassDiagram[] {
  const diagrams: ParsedClassDiagram[] = [];
  
  // Parse each node (class) in the diagram
  for (const node of json.nodeDataArray) {
    const fields: UMLAttribute[] = [];
    const relations: UMLRelation[] = [];
    
    // Parse properties
    if (node.properties) {
      for (const prop of node.properties) {
        fields.push(parsePropertyString(prop));
      }
    }
    
    diagrams.push({
      name: node.name.replace('<<Interface>>', '').trim(),
      fields,
      relations
    });
  }
  
  // Parse relationships
  for (const link of json.linkDataArray) {
    const sourceClass = json.nodeDataArray.find((n: any) => n.key === link.from);
    const targetClass = json.nodeDataArray.find((n: any) => n.key === link.to);
    
    if (sourceClass && targetClass) {
      const relationType = determineRelationType(link.text, link.fromText, link.toText);
      
      const classIndex = diagrams.findIndex(d => d.name === sourceClass.name);
      if (classIndex !== -1) {
        diagrams[classIndex].relations.push({
          type: relationType as any,
          target: targetClass.name.replace('<<Interface>>', '').trim(),
          field: link.text.toLowerCase()
        });
      }
    }
  }
  
  return diagrams;
}
