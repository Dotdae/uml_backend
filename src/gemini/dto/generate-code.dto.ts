import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateCodeDto {
    @IsString()
    @IsNotEmpty()
    umlData: string;

    @IsString()
    @IsNotEmpty()
    language: string;
}