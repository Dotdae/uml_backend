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
    default: true,
  })
  isActive: boolean;

  @Column('text', {
    nullable: false,
  })
  fullName: string;

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
