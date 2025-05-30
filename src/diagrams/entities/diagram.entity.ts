import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { DiagramType } from './diagram-type.entity';

@Entity('diagram')
export class Diagram {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'id_project' })
  idProject: number;

  @Column({ type: 'json' })
  infoJson: Record<string, any>;

  @Column()
  type: number;

  @Column({ name: 'version', type: 'int', default: 1 })
  version: number;

  @Column({ name: 'name', type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => Project, project => project.diagrams)
  @JoinColumn({ name: 'id_project' })
  project: Project;

  @ManyToOne(() => DiagramType, diagramType => diagramType.diagrams)
  @JoinColumn({ name: 'type' })
  diagramType: DiagramType;
} 