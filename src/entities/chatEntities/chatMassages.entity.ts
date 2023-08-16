import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TimestampEntity } from '../baseEntity/timestamp.entity';
import { ChatNames } from './chatName.entity';
import { Users } from '../users.entity';

@Entity()
export class ChatMessages extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;

    @Column()
    userName: string;

    @ManyToOne(type => Users, users => users.chatMessages)
    users: Users;
    
    @ManyToOne(type => ChatNames, chatNames => chatNames.chatMessages, {cascade:true})
    @JoinColumn({ referencedColumnName: 'roomName', name: 'roomName' })
    chatNames: ChatNames 
}
