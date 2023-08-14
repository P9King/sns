import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, ManyToOne, JoinTable, OneToMany } from 'typeorm';
import { Users } from '../users.entity';
import { TimestampEntity } from '../baseEntity/timestamp.entity';
import { ChatMessages } from './chatMassages.entity';

@Entity()
export class ChatNames extends TimestampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  roomName: string;


  // @OneToMany(type => ChatRooms, chatRooms => chatRooms.chatNames)
  // chatRooms: Array<ChatRooms>


  //many to many and join table
  @ManyToMany(type => Users, user => user.chatRooms)
  users: Array<Users>;

  @OneToMany(type => ChatMessages, chatMessages => chatMessages.chatNames)
  chatMessages: Array<ChatMessages>
}
