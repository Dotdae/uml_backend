import { PartialType } from '@nestjs/mapped-types';
import { CreateUsecaseDto } from './create-usecase.dto';

export class UpdateUsecaseDto extends PartialType(CreateUsecaseDto) {}
