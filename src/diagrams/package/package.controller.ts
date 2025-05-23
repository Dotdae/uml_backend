import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { Package } from './entities/package.entity';

@Controller('package')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

    // 🔹 Crear un nuevo paquete
    @Post()
    async create(@Body() createPackageDto: CreatePackageDto): Promise<Package> {
      return await this.packageService.create(createPackageDto);
    }

  // 🔹 Obtener todos los paquetes
  @Get()
  async findAll(): Promise<Package[]> {
    return await this.packageService.findAll();
  }

  @Get(':id') 
  findOne(@Param('id') id: string) {
    return this.packageService.findOne(+id);
  }

    // 🔹 Actualizar un paquete
    @Patch(':id')
    async update(
      @Param('id', ParseIntPipe) id: number,
      @Body() updatePackageDto: UpdatePackageDto,
    ): Promise<Package> {
      return await this.packageService.update(id, updatePackageDto);
    }
   // 🔹 Eliminar un paquete
   @Delete(':id')
   async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
     return await this.packageService.remove(id);
   }
}
