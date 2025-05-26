// src/entities/pagable.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

@Entity()
export class Pagable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  private invalid: string;

  getInvalid(): string {
    return this.invalid;
  }

  setInvalid(invalid: string): void {
    this.invalid = invalid;
  }
}