import { IsString, IsNotEmpty, IsUUID, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsUUID()
  @IsOptional()
  userUUID?: string;

  @IsString()
  @IsNotEmpty()
  projectName: string;
} 