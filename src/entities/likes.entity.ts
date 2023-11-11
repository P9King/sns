import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Users } from './users.entity';
import { Boards } from './boards.entity';

@Entity()
export class Likes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne((type) => Users, (users) => users.likes)
  users: Users;

  @ManyToOne((type) => Boards, (boards) => boards.like)
  boards: Boards;
}
