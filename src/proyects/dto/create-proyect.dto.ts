import { IsString, IsUUID } from 'class-validator';

export class CreateProyectDto {
    @IsString()
    name: string;

    @IsUUID() 
    userID: string;
}
