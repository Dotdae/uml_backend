import { IsString, IsNotEmpty, IsUUID, IsOptional, IsInt } from 'class-validator';

export class CreateProjectDto {
  @IsUUID()
  @IsNotEmpty()
  userUUID: string;

  @IsString()
  @IsNotEmpty()
  projectName: string;

  @IsInt()
  @IsOptional()
  statusId?: number;

  @IsInt()
  @IsOptional()
  generatedCounter?: number;
}
