import { Diagram } from '../entities/diagram.entity';

export interface DiagramResponse extends Diagram {
  typeString: string;
}
