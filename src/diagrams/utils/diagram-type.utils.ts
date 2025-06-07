import { DiagramType } from '../enums/diagram-type.enum';

export function getDiagramTypeString(typeId: number): string {
  switch (typeId) {
    case DiagramType.CLASS:
      return 'CLASS';
    case DiagramType.SEQUENCE:
      return 'SEQUENCE';
    case DiagramType.PACKAGE:
      return 'PACKAGE';
    case DiagramType.COMPONENTS:
      return 'COMPONENTS';
    case DiagramType.USECASE:
      return 'USECASE';
    default:
      throw new Error(`Invalid diagram type ID: ${typeId}`);
  }
}

export function getDiagramTypeId(typeString: string): DiagramType {
  const type = typeString.toUpperCase();
  switch (type) {
    case 'CLASS':
      return DiagramType.CLASS;
    case 'SEQUENCE':
      return DiagramType.SEQUENCE;
    case 'PACKAGE':
      return DiagramType.PACKAGE;
    case 'COMPONENTS':
      return DiagramType.COMPONENTS;
    case 'USECASE':
      return DiagramType.USECASE;
    default:
      throw new Error(`Invalid diagram type string: ${typeString}`);
  }
}
