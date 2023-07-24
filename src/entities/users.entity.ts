import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Boards } from './boards.entity';

@Entity()
export class Users {
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
