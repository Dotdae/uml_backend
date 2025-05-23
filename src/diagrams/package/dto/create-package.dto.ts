import { IsJSON, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePackageDto {
    @IsNotEmpty()
    @IsJSON()
    info: string;

    @IsNotEmpty()
    @IsNumber()
    projectId: number;
}