import { IsNumber, IsNotEmpty, IsObject, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { DiagramType } from '../enums/diagram-type.enum';

export class CreateDiagramDto {
  @IsNumber()
  @IsNotEmpty()
  idProject: number;

  @IsObject()
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    }
    return value;
  })
  infoJson: Record<string, any>;

  @IsEnum(DiagramType)
  @IsNotEmpty()
  type: DiagramType;

  @IsString()
  @IsNotEmpty()
  name: string;
}
