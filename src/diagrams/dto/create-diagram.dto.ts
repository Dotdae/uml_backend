import { IsNumber, IsNotEmpty, IsObject } from 'class-validator';
import { Transform } from 'class-transformer';

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

  @IsNumber()
  @IsNotEmpty()
  type: number;
} 