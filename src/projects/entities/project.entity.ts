import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Diagram } from '../../diagrams/entities/diagram.entity';
import { User } from '../../users/entities/user.entity';
import { Status } from '../../status/entities/status.entity';

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

  @Column({name: 'generated_counter', type: 'int', default: 0})
  generatedCounter: number;

  @Column({ name: 'status_id', type: 'int', nullable: true })
  statusId: number;

  @ManyToOne(() => Status, status => status.projects)
  @JoinColumn({ name: 'status_id' })
  status: Status;

  @CreateDateColumn({name: 'created_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  createdAt: Date;

  @CreateDateColumn({name: 'updated_at', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  updatedAt: Date;
}
