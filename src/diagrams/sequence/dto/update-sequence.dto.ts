import { PartialType } from '@nestjs/mapped-types';
import { CreateSequenceDto } from './create-sequence.dto';
import { IsJSON } from 'class-validator';

export class UpdateSequenceDto extends PartialType(CreateSequenceDto) {
    @IsJSON()
    info?: string;
}
