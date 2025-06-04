interface SequenceMessage {
  from: string;
  to: string;
  message: string;
  type: 'call' | 'return';
}

export interface ParsedSequenceDiagram {
  name: string;
  actor: string;
  messages: SequenceMessage[];
}

export function parseSequenceDiagram(json: any): ParsedSequenceDiagram {
  const messages: SequenceMessage[] = [];
  const actors = new Set<string>();

  const nodes = json.nodes || [];
  const connections = json.connections || [];

  nodes.forEach((node: any) => {
    if (node.type === 'actor') {
      actors.add(node.data.label || 'Actor');
    }
  });

  connections.forEach((conn: any) => {
    const fromNode = nodes.find((n: any) => n.id === conn.source);
    const toNode = nodes.find((n: any) => n.id === conn.target);

    if (fromNode && toNode) {
      messages.push({
        from: fromNode.data.label,
        to: toNode.data.label,
        message: conn.message || 'message()',
        type: 'call'
      });
    }
  });

  const actor = Array.from(actors)[0] || 'Actor';

  return {
    name: json.name || 'SequenceDiagram',
    actor,
    messages
  };
}