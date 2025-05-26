// src/entities/persona.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm';
import { IsString, IsInt, IsOptional, Min, Max, Length } from 'class-validator';

@Entity()
export class Persona extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  private nombre: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  private apellido: string | null;

  @Column({ type: 'int', nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(150)
  private edad: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  @IsOptional()
  @IsString()
  @Length(0, 255)
  protected direccion: string | null;

  // Getters and setters for private fields (nombre)
  getNombre(): string | null {
    return this.nombre;
  }

  setNombre(nombre: string | null): void {
    this.nombre = nombre;
  }

  // Getters and setters for private fields (apellido)
  getApellido(): string | null {
    return this.apellido;
  }

  setApellido(apellido: string | null): void {
    this.apellido = apellido;
  }

  // Getters and setters for private fields (edad)
  getEdad(): number | null {
    return this.edad;
  }

  setEdad(edad: number | null): void {
    this.edad = edad;
  }

  // Getters and setters for protected fields (direccion)
  getDireccion(): string | null {
    return this.direccion;
  }

  setDireccion(direccion: string | null): void {
    this.direccion = direccion;
  }
}