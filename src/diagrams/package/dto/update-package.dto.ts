import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageDto } from './create-package.dto';
import { IsJSON } from 'class-validator';

export class UpdatePackageDto extends PartialType(CreatePackageDto) {
    @IsJSON()
    info?: string;
}