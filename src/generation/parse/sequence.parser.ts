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
  return {
    name: json.name,
    actor: json.actor,
    messages: json.messages.map((msg: any) => ({
      from: msg.from,
      to: msg.to,
      message: msg.message,
      type: msg.type,
    })),
  };
}