import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Boards } from './boards.entity';
import { TimestampEntity } from './baseEntity/timestamp.entity';

@Entity()
export class Users extends TimestampEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    name: string;

    @Column({length: 120})
    password: string;

    @OneToMany((type)=> Boards, (boards)=> boards.users)
    boards: Array<Boards>;
}
