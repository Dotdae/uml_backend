import { Project } from '../../projects/entities/project.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text')
  password: string;

  @Column('boolean', {
    default: false,
  })
  isActive: boolean;

  @Column('boolean', {
    default: false,
  })
  isVerified: boolean;

  @Column('text', {
    nullable: false,
  })
  fullName: string;

  @Column('text', {
    nullable: true,
  })
  avatarUrl: string;
  phone: string;

  @Column('date', {
    nullable: true,
  })
  birthdate: Date;

  @Column('text', {
    nullable: true,
  })
  lastName: string;

  @Column('boolean', {
    default: false,
  })
  isGoogleUser: boolean;
  avatar: string;

  @Column('text', {
    nullable: true,
  })
  verificationCode: string;

  @Column('text', { nullable: true })
  resetCode: string;

  @Column('timestamp', { nullable: true })
  resetExpires: Date;

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }

  @OneToMany(() => Project, (project) => project.userUUID)
  projects: Project[];
}
