import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Diagram } from './diagram.entity';

@Entity('diagram_type')
export class DiagramType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  type: string;

  @OneToMany(() => Diagram, diagram => diagram.type)
  diagrams: Diagram[];
} 