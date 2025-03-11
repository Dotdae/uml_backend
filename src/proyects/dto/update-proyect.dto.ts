import { PartialType } from '@nestjs/mapped-types';
import { CreateProyectDto } from './create-proyect.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateProyectDto extends PartialType(CreateProyectDto) {
    @IsString()
    @IsNotEmpty()
    name: string;
}
