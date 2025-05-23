import { IsNotEmpty, IsUUID, IsJSON } from 'class-validator';

export class CreateClassDto {
  @IsNotEmpty()
  @IsJSON()
  info: string;

  @IsNotEmpty()
  projectId: number;
}