import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { of } from 'rxjs';
import { ChatNames } from 'src/entities/chatEntities/chatName.entity';
import { Users } from 'src/entities/users.entity';
import { ReturnStatus } from 'src/enum.status';
import { Index, Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatNames)
        private chatRoomsRepository: Repository<ChatNames>,

        @InjectRepository(Users)
        private usersRepository: Repository<Users>,

    ) { }

    //get chat list
    async getChatList(userInfo: Users): Promise<ChatNames[]> {
        console.log("get user info in service", userInfo);

        const user = new Users();
        user.id = userInfo.id;
        //= await this.usersRepository.findOne({ where: { id: userInfo.id } })

        const chatList = await this.chatRoomsRepository.createQueryBuilder('chatRoom') //alias
            .innerJoin('chatRoom.users', 'users')
            .where('users.id = :userId', { userId: user.id })
            .getMany();

        console.log("get chat list in the service", chatList);

        return chatList;
    }


    //create ChatRoom Name
    async createChatRoomName(roomName: string): Promise<ReturnStatus> {
        console.log("SERVICE ", roomName);
        const isRoomExist = await this.chatRoomsRepository.findOne({ where: { roomName: roomName } })
        console.log("isRoomExist ", isRoomExist);
        if (isRoomExist) {
            return ReturnStatus.FAILURE;
        } else {
            return ReturnStatus.SUCCESS;
        }
    }

    //add chat user
    async addUser(email: string): Promise<Users | ReturnStatus> {
        const userInfo = await this.usersRepository.findOne({
            where: { email: email }
        })

        if (userInfo) {
            return userInfo;
        } else {
            return ReturnStatus.FAILURE;
        }
    }

    //create new chat 
    // async createChatRoom(emails: string, roomName: string) {
    //     console.log("service emails: ", emails);
    //     console.log("service room name: ", roomName);

    //     const emailArray = emails.split(",").map(email => email.trim());

    //     for (const email of emailArray) {

    //         const users = await this.usersRepository.findOne({ where: { email: email } })

    //         const chatRoomEntity = new ChatNames();
    //         chatRoomEntity.roomName = roomName;
    //         //chatRoomEntity.users = users;

    //         const chatRoom = await this.chatRoomsRepository.save(chatRoomEntity);
    //         console.log("save is work", chatRoom);
    //     }

    // }


    async createChatRoom(emails: string, roomName: string) {
        console.log("service emails: ", emails);
        console.log("service room name: ", roomName);

        const emailArray = emails.split(",").map(email => email.trim());

        const chatRoomEntity = new ChatNames();
        chatRoomEntity.roomName = roomName;

        for (const email of emailArray) {
            const users = await this.usersRepository.findOne({ where: { email: email } })

            if (!chatRoomEntity.users) {
                chatRoomEntity.users = [];
            }
            chatRoomEntity.users.push(users);

        }
        const chatRoom = await this.chatRoomsRepository.save(chatRoomEntity);
        console.log("save is work", chatRoom);
    }

    //get chat history
    async getChatHistory(roomName: string){
        
    }
}
