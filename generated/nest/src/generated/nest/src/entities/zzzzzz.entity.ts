// generated/nest/src/entities/zzzzzz.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Zzzzzz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true, type: 'text' })
  newProperty: string | null;

  @Column({ nullable: true })
  newPropertyString: string | null;
}