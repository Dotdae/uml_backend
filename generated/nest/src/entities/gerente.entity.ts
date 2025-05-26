// src/entities/gerente.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

@Entity()
export class Gerente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'integer' })
  @IsOptional()
  @IsInt()
  private nivelAcceso: number;

  @Column({ type: 'varchar', length: 255 })
  @IsString()
  @MaxLength(255)
  private invalid: string;

    // Getter for nivelAcceso
    public getNivelAcceso(): number {
        return this.nivelAcceso;
    }

    // Setter for nivelAcceso
    public setNivelAcceso(nivelAcceso: number): void {
        this.nivelAcceso = nivelAcceso;
    }

    // Getter for invalid
    public getInvalid(): string {
        return this.invalid;
    }

    // Setter for invalid
    public setInvalid(invalid: string): void {
        this.invalid = invalid;
    }
}