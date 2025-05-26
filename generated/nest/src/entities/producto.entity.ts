// src/entities/producto.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  private codigo: string;

  @Column({ nullable: true })
  @IsString()
  @IsOptional()
  private nombre: string;

  @Column({ type: 'double', nullable: true })
  @IsNumber()
  @IsOptional()
  private precio: number;

  @Column({ type: 'int', nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  private stock: number;

  constructor(codigo?: string, nombre?: string, precio?: number, stock?: number) {
    this.codigo = codigo;
    this.nombre = nombre;
    this.precio = precio;
    this.stock = stock;
  }

  // Getters and Setters
  getCodigo(): string {
    return this.codigo;
  }

  setCodigo(codigo: string): void {
    this.codigo = codigo;
  }

  getNombre(): string {
    return this.nombre;
  }

  setNombre(nombre: string): void {
    this.nombre = nombre;
  }

  getPrecio(): number {
    return this.precio;
  }

  setPrecio(precio: number): void {
    this.precio = precio;
  }

  getStock(): number {
    return this.stock;
  }

  setStock(stock: number): void {
    this.stock = stock;
  }
}