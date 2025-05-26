// src/entities/empleado.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsNumber, IsString, IsDate, MaxLength, MinLength, IsOptional } from 'class-validator';

@Entity()
export class Empleado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'double', nullable: true, default: null })
  @IsNumber()
  @IsOptional()
  private salario: number | null;

  @Column({ type: 'varchar', length: 255, nullable: true, default: null })
  @IsString()
  @MaxLength(255)
  @IsOptional()
  private departamento: string | null;

  @Column({ type: 'date', nullable: true, default: null })
  @IsDate()
  @IsOptional()
  private fechaContratacion: Date | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Getters and Setters (Optional but recommended for private properties)

  getSalario(): number | null {
    return this.salario;
  }

  setSalario(salario: number | null): void {
    this.salario = salario;
  }

  getDepartamento(): string | null {
    return this.departamento;
  }

  setDepartamento(departamento: string | null): void {
    this.departamento = departamento;
  }

  getFechaContratacion(): Date | null {
    return this.fechaContratacion;
  }

  setFechaContratacion(fechaContratacion: Date | null): void {
    this.fechaContratacion = fechaContratacion;
  }
}