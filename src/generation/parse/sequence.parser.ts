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
  // Validate input
  if (!json || typeof json !== 'object') {
    throw new Error('Invalid sequence diagram: Input must be a valid JSON object');
  }

  const messages: SequenceMessage[] = [];
  const actors = new Set<string>();

  // Extract actors and messages from nodeDataArray if available
  if (json.nodeDataArray && Array.isArray(json.nodeDataArray)) {
    // Find all actors (lifelines)
    json.nodeDataArray.forEach((node: any) => {
      if (node.category === 'Lifeline' || node.isLifeline) {
        actors.add(node.text || node.name || `Actor${actors.size + 1}`);
      }
    });
  }

  // Extract messages from linkDataArray if available
  if (json.linkDataArray && Array.isArray(json.linkDataArray)) {
    json.linkDataArray.forEach((link: any) => {
      if (link.from && link.to) {
        // Find source and target nodes
        const fromNode = json.nodeDataArray?.find((n: any) => n.key === link.from);
        const toNode = json.nodeDataArray?.find((n: any) => n.key === link.to);
        
        if (fromNode && toNode) {
          const fromActor = fromNode.text || fromNode.name || 'UnknownActor';
          const toActor = toNode.text || toNode.name || 'UnknownActor';
          
          messages.push({
            from: fromActor,
            to: toActor,
            message: link.text || link.name || 'Unnamed Message',
            type: link.category === 'Return' ? 'return' : 'call'
          });
        }
      }
    });
  }

  // Ensure we have at least one message if none found
  if (messages.length === 0) {
    messages.push({
      from: 'DefaultActor',
      to: 'System',
      message: 'Default Action',
      type: 'call'
    });
    actors.add('DefaultActor');
    actors.add('System');
  }

  // Get the main actor (usually the first one or the one with most outgoing messages)
  const mainActor = actors.size > 0 
    ? Array.from(actors)[0]
    : 'DefaultActor';

  return {
    name: json.name || json.class || 'Default Sequence',
    actor: mainActor,
    messages
  };
}