import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';
import { Diagram } from '../../diagrams/entities/diagram.entity';
import { User } from '../../users/entities/user.entity';

@Entity('trash_bin')
export class TrashBin {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'project_id', type: 'int', nullable: true })
  projectId: number;

  @Column({ name: 'diagram_id', type: 'int', nullable: true })
  diagramId: number;

  @Column({ name: 'deleted_by', type: 'uuid' })
  deletedBy: string;

  @CreateDateColumn({ name: 'deleted_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  deletedAt: Date;

  @ManyToOne(() => Project, { nullable: true })
  @JoinColumn({ name: 'project_id' })
  project: Project;

  @ManyToOne(() => Diagram, { nullable: true })
  @JoinColumn({ name: 'diagram_id' })
  diagram: Diagram;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'deleted_by' })
  user: User;
}
