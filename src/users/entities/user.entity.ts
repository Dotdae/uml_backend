import { Proyect } from "src/proyects/entities/proyect.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text',{
        unique: true
    })
    email:string;

    @Column('text')
    password:string;

    @OneToMany(
        () => Proyect,
        (project) => project.userID,
        {onUpdate:'CASCADE'}
    )
    project: Proyect[];
}
