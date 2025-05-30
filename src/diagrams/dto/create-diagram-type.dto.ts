import { IsString, IsNotEmpty } from 'class-validator';
 
export class CreateDiagramTypeDto {
  @IsString()
  @IsNotEmpty()
  type: string;
} 