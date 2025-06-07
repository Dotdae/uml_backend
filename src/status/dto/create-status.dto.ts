import { IsString, MaxLength } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  @MaxLength(100)
  name: string;
}
