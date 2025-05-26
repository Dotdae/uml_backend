// src/entities/contacto.entity.ts
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { Empresa } from './empresa.entity';

@Entity()
export class Contacto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nombre: string;

  @ManyToOne(() => Empresa, (empresa) => empresa.contactos)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ name: 'empresa_id' })
  empresa_id: number; // Foreign key column

}