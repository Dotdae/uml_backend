import { PartialType } from '@nestjs/mapped-types';
import { CreateClassDto } from './create-class.dto';
import { IsJSON } from 'class-validator';

export class UpdateClassDto extends PartialType(CreateClassDto) {
     @IsJSON()
  info?: string;
}
