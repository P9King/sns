import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Users } from './users.entity';
import { TimestampEntity } from './baseEntity/timestamp.entity';
import { Files } from './files.entity';
import { Likes } from './likes.entity';

@Entity()
export class Boards extends TimestampEntity{
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

    @Column({ default: 0 })
    like: number;

    @ManyToOne((type) => Users, (users)=> users.boards, { eager: true })
    users: Users;

    @OneToMany(type => Files, files => files.boards, {cascade: true})
    files: Array<Files>;

    @OneToMany(type => Likes, likes => likes.boards)
    likes: Array<Likes>;
    
}

export enum BoardStatus{
    PRIVATE = "private",
    PUBLIC = "public",
    DB_ERROR = "db_error"
}
