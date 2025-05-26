// src/entities/cliente.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { IsString, IsOptional, MaxLength } from 'class-validator';

@Entity()
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  private numeroCliente: string;

  @CreateDateColumn({ nullable: true, type: 'timestamp' })
  @IsOptional()
  private fechaRegistro: Date;

  @Column({ type: 'varchar', length: 255, default: 'false' })
  @IsString()
  @MaxLength(255)
  private invalid: string;

  // Getters and setters for private properties

  public getNumeroCliente(): string | null {
    return this.numeroCliente;
  }

  public setNumeroCliente(numeroCliente: string | null): void {
    this.numeroCliente = numeroCliente;
  }

  public getFechaRegistro(): Date | null {
    return this.fechaRegistro;
  }

  public setFechaRegistro(fechaRegistro: Date | null): void {
    this.fechaRegistro = fechaRegistro;
  }

  public getInvalid(): string {
    return this.invalid;
  }

  public setInvalid(invalid: string): void {
    this.invalid = invalid;
  }
}