import { Proyect } from "src/proyects/entities/proyect.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('sequence')
export class Sequence {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('json')
    info: string;

    @ManyToOne(
        () => Proyect,
        (project) => project.id,
        {onDelete: 'CASCADE'}
    )
    project: Proyect;
}
