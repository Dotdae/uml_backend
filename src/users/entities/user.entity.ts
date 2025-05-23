import { Proyect } from 'src/proyects/entities/proyect.entity';
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

  @Column('text', {
    nullable: true,
  })
  lastName: string;

  @Column('boolean', {
    default: false,
  })
  isGoogleUser: boolean;

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

  @OneToMany(() => Proyect, (project) => project.userID, {
    onUpdate: 'CASCADE',
  })
  project: Proyect[];
}
