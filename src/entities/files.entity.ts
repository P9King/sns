import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TimestampEntity } from './baseEntity/timestamp.entity';
import { Boards } from './boards.entity';

@Entity() //timestamp
export class Files extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  originalName: string;

  @Column()
  storedName: string;

  @Column()
  filePath: string;

  @ManyToOne((type) => Boards, (boards) => boards.files, {
    eager: true,
    onDelete: 'CASCADE',
  }) //여기도 삭제를 위해 케스케이드 필요
  @JoinColumn({ name: 'boardsId' })
  boards: Boards;
}
