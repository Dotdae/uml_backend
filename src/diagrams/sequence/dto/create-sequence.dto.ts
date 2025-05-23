import { IsJSON, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateSequenceDto {
    @IsJSON()
    @IsNotEmpty()
    info: string;

    @IsNumber()
    @IsNotEmpty()
    projectId: number;
}