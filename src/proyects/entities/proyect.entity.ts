import { Class } from "src/diagrams/class/entities/class.entity";
import { Component } from "src/diagrams/component/entities/component.entity";
import { Package } from "src/diagrams/package/entities/package.entity";
import { Sequence } from "src/diagrams/sequence/entities/sequence.entity";
import { Usecase } from "src/diagrams/usecase/entities/usecase.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('projects')
export class Proyect {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => User, (user) => user.projects, { onDelete: 'CASCADE' })
  userID: User;

  @OneToMany(() => Sequence, (sequence) => sequence.project, { onUpdate: 'CASCADE' })
  sequence: Sequence[];

  @OneToMany(() => Class, (clase) => clase.project, { onUpdate: 'CASCADE' })
  clase: Class[];

  @OneToMany(() => Usecase, (usecase) => usecase.project, { onUpdate: 'CASCADE' })
  usecase: Usecase[];

  @OneToMany(() => Package, (paquete) => paquete.project, { onUpdate: 'CASCADE' })
  paquete: Package[];

  @OneToMany(() => Component, (component) => component.project, { onUpdate: 'CASCADE' })
  component: Component[];
}