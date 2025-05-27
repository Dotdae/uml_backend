import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Diagram } from '../../diagrams/entities/diagram.entity';
import { User } from '../../users/entities/user.entity';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_uuid', type: 'uuid', nullable: true })
  userUUID: string | null;

  @Column({ name: 'project_name', type: 'varchar' })
  projectName: string;

  @ManyToOne(() => User, user => user.projects)
  @JoinColumn({ name: 'user_uuid', referencedColumnName: 'id' })
  user: User;

  @OneToMany(() => Diagram, diagram => diagram.project)
  diagrams: Diagram[];
} 