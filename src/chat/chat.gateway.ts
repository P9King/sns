import { Req, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatMessages } from 'src/entities/chatEntities/chatMassages.entity';
import { ChatNames } from 'src/entities/chatEntities/chatName.entity';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({namespace: 'chat', cors:true})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
    @InjectRepository(Users)
    private authRepository: Repository<Users>,
    @InjectRepository(ChatMessages)
    private messageRepository: Repository<ChatMessages>,
    @InjectRepository(ChatNames)
    private chatNamesRepository: Repository<ChatNames>
    ){}



  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    if (client.connected) {
      console.log(`Client connected: ${client.id}`);
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  async handleRoomName(client: Socket, roomName: string): Promise<void> {
    
    const chatRoomName  = await this.chatNamesRepository.findOne({
      where: {
        roomName: roomName
      }
    });
    
    const chatHistory = await this.messageRepository.find({
      where: {
        chatNames: chatRoomName.chatMessages
      },
      order: {
        createdAt: 'ASC',
      },
    })

    console.log('Room name received:', roomName); 
    console.log('Room name chatHistory:', chatHistory);
    client.join(roomName); // Connect the client to the room
    this.server.to(roomName).emit('userJoined', {chatHistory: chatHistory});
  }

  @SubscribeMessage('message')
  async handleMessage(client: Socket,  payload: { message: string, roomName: string, userEmail: string }): Promise<void> {
    const { message, roomName, userEmail } = payload;
    console.log(message);

    //token
    //console.log("users entity ", client.handshake.auth.token);

    //DB
    const userInfo = await this.authRepository.findOne({
      where: {
        email: userEmail
      }
    })

    const chatRoomName  = await this.chatNamesRepository.findOne({
      where: {
        roomName: roomName
      },
    });

    const chatMessage = new ChatMessages();
    chatMessage.chatNames = chatRoomName;
    chatMessage.users = userInfo;
    chatMessage.userName = userInfo.name;
    chatMessage.message = message;

    const save = await this.messageRepository.save(chatMessage);

    client.join(roomName);
    this.server.to(roomName).emit('message', {message: message, userName: userInfo.name});
  }
}