import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Users } from './users.entity';

@Entity()
export class Boards {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    status: BoardStatus;

    @Column()
    file_attached: number;

    
    @ManyToOne((type) => Users, (users)=> users.boards, { eager: true })
    users: Users;
    
}

export enum BoardStatus{
    PRIVATE = "private",
    PUBLIC = "public"
}
