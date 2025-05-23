import { IsNotEmpty, IsUUID, IsJSON } from 'class-validator';

export class CreateComponentDto {
  @IsNotEmpty()
  @IsJSON()
  info: string;

  @IsNotEmpty()
  projectId: number;
}