// src/entities/empresa.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength, IsOptional } from 'class-validator';
import { Contacto } from './contacto.entity'; // Assuming you have a Contacto entity

@Entity()
export class Empresa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  private nombre: string;

  @Column({ nullable: true, length: 13 })
  @IsString()
  @MaxLength(13)
  @IsOptional()
  private rfc: string;

  @Column({ nullable: false, default: 'default_value' }) // Provide a default value to prevent null exceptions
  @IsString()
  @IsNotEmpty()
  private invalid: string;

  @Column({ nullable: false, default: 'default_value' }) // Provide a default value to prevent null exceptions
  @IsString()
  @IsNotEmpty()
  private invalid2: string;

  @OneToMany(() => Contacto, (contacto) => contacto.empresa)
  contactos: Contacto[];


  // Getter for nombre
  getNombre(): string {
    return this.nombre;
  }

  // Setter for nombre
  setNombre(nombre: string): void {
    this.nombre = nombre;
  }

    // Getter for rfc
  getRfc(): string {
    return this.rfc;
  }

  // Setter for rfc
  setRfc(rfc: string): void {
    this.rfc = rfc;
  }

   // Getter for invalid
  getInvalid(): string {
    return this.invalid;
  }

  // Setter for invalid
  setInvalid(invalid: string): void {
    this.invalid = invalid;
  }

     // Getter for invalid2
  getInvalid2(): string {
    return this.invalid2;
  }

  // Setter for invalid2
  setInvalid2(invalid2: string): void {
    this.invalid2 = invalid2;
  }

}