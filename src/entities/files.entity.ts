import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { TimestampEntity } from './baseEntity/timestamp.entity';
import { Boards } from './boards.entity';

@Entity()                   //timestamp
export class Files extends TimestampEntity{
  
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    originalName: string;

    @Column()
    storedName: string;

    @Column()
    filePath: string;

    @ManyToOne(type => Boards, boards => boards.id, {eager: true, cascade: true})
    boards: Boards


}
