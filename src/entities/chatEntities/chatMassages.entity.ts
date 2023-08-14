import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { TimestampEntity } from '../baseEntity/timestamp.entity';
import { ChatNames } from './chatName.entity';

@Entity()
export class ChatMessages extends TimestampEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    message: string;
    
    @ManyToOne(type => ChatNames, chatNames => chatNames.chatMessages, {cascade:true})
    @JoinColumn({ referencedColumnName: 'roomName', name: 'roomName' })
    chatNames: ChatNames 
}
