import { IsOptional, IsInt, IsUUID } from 'class-validator';

export class CreateTrashBinDto {
  @IsOptional()
  @IsInt()
  projectId?: number;

  @IsOptional()
  @IsInt()
  diagramId?: number;

  @IsUUID()
  deletedBy: string;
}
