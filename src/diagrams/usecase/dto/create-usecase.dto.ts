import { IsJSON, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreateUsecaseDto {
    @IsJSON()
    @IsNotEmpty()
    info: string;

    @IsNumber()
    @IsNotEmpty()
    projectId: number;
}