import { PartialType } from '@nestjs/mapped-types';
import { CreateProyectDto } from './create-proyect.dto';

export class UpdateProyectDto extends PartialType(CreateProyectDto) {}
