import { Class } from "src/diagrams/class/entities/class.entity";
import { Component } from "src/diagrams/component/entities/component.entity";
import { Package } from "src/diagrams/package/entities/package.entity";
import { Sequence } from "src/diagrams/sequence/entities/sequence.entity";
import { Usecase } from "src/diagrams/usecase/entities/usecase.entity";
import { User } from "src/users/entities/user.entity";
import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('projects')
export class Proyect {

    @PrimaryGeneratedColumn()
    id:number

    @ManyToOne(
        () => User,
        (user) => user.id,
        {onDelete: 'CASCADE'}
    )
    userID:User;
    
    @OneToMany(
        () => Sequence,
        (sequence) => sequence.id,
        {onUpdate: 'CASCADE'}
    )
    sequence:Sequence[];

    @OneToMany(
        () => Class,
        (clase) => clase.id,
        {onUpdate: 'CASCADE'}
    )
    clase:Class[];

    @OneToMany(
        () => Usecase,
        (usecase) => usecase.id,
        {onUpdate: 'CASCADE'}
    )
    usecase:Usecase[];

    @OneToMany(
        () => Package,
        (paquete) => paquete.id,
        {onUpdate: 'CASCADE'}
    )
    paquete:Package[];

    @OneToMany(
        () => Component,
        (component) => component.id,
        {onUpdate: 'CASCADE'}
    )
    component:Component[];
}
