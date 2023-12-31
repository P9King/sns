import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Boards } from './boards.entity';
import { TimestampEntity } from './baseEntity/timestamp.entity';
import { Likes } from './likes.entity';
import { ChatNames } from './chatEntities/chatName.entity';
import { ChatMessages } from './chatEntities/chatMassages.entity';

@Entity()
export class Users extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ length: 120 })
  password: string;

  @OneToMany(() => Boards, (boards) => boards.users)
  boards: Array<Boards>;

  @OneToMany(() => Likes, (likes) => likes.users)
  likes: Array<Likes>;

  @OneToMany(() => ChatMessages, (chatMessages) => chatMessages.users)
  chatMessages: Array<ChatMessages>;

  @ManyToMany(() => ChatNames, (chatNames) => chatNames.users)
  @JoinTable({
    name: 'chat_rooms', // 연결 테이블 이름 설정
    joinColumn: {
      name: 'userId', // Users 테이블의 외래 키 설정
      referencedColumnName: 'id', // Users 테이블의 참조 컬럼 설정
    },
    inverseJoinColumn: {
      name: 'roomName', // ChatNames 테이블의 외래 키를 roomName으로 설정
      referencedColumnName: 'roomName', // ChatNames 테이블의 참조 컬럼을 roomName으로 설정
    },
  })
  chatRooms: Array<ChatNames>;
}
