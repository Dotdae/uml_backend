// src/entities/compra.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

@Entity()
export class Compra {
  @PrimaryGeneratedColumn('uuid')
  private id: string;

  @CreateDateColumn()
  private fecha: Date;

  @Column({ type: 'double precision', nullable: true })
  @IsNumber()
  @IsOptional()
  private monto: number;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  private invalid: string;

  public getId(): string {
    return this.id;
  }

  public getFecha(): Date {
    return this.fecha;
  }

  public getMonto(): number {
    return this.monto;
  }

  public getInvalid(): string {
    return this.invalid;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public setFecha(fecha: Date): void {
    this.fecha = fecha;
  }

  public setMonto(monto: number): void {
    this.monto = monto;
  }

  public setInvalid(invalid: string): void {
    this.invalid = invalid;
  }
}