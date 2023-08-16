import { Body, Controller, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ReturnStatus } from 'src/enum.status';
import { Users } from 'src/entities/users.entity';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ChatNames } from 'src/entities/chatEntities/chatName.entity';
import { ChatMessages } from 'src/entities/chatEntities/chatMassages.entity';

@Controller('api/chat')
export class ChatController {
    constructor(private chatService: ChatService) { }


    //get chat list
    @Post('getChatList')
    @UseGuards(AuthGuard)
    getChatList(@Req() req): Promise<ChatNames[]>{
        return this.chatService.getChatList(req.user);
    }

    // add chat users
    @Post('addUser')
    addUser(@Query('email') email: string): Promise<Users | ReturnStatus> {
        console.log('working, this is email', email);
        return this.chatService.addUser(email)
    }

    //create chat room name
    @Post('createChatRoomName')
    createChatRoomName(@Query('roomName') roomName: string): Promise<ReturnStatus> {
        console.log('controller room name is ' + roomName);
        return this.chatService.createChatRoomName(roomName);
    }

    //create chat room 
    @Post('createChatRoom')
    createChatRoom(@Query('email') emails: string, @Query('roomName') roomName: string) {
        console.log('create chat room emails', emails);
        console.log('create chat room roomName', roomName);
        
        return this.chatService.createChatRoom(emails, roomName);

    }

    //get chat history
    @Post('/chatRoom/joinRoom')
    getChatHistory(@Query('roomName') roomName: string): Promise<ChatMessages[] |ReturnStatus>{
        console.log("room name in controller ",roomName);
        return this.chatService.getChatHistory(roomName);
    }

}
