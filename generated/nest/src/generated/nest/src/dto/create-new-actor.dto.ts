// generated/nest/src/dto/create-new-actor.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateNewActorDto {
  @IsString()
  @IsNotEmpty()
  action: string;

  @IsString()
  @IsNotEmpty()
  action2: string;
}