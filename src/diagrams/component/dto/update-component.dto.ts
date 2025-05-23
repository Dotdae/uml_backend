import { PartialType } from '@nestjs/mapped-types';
import { CreateComponentDto } from './create-component.dto';
import { IsJSON } from 'class-validator';

export class UpdateComponentDto extends PartialType(CreateComponentDto) {
  @IsJSON()
  info?: string;
}