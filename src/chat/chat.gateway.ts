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
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { UserDto } from 'src/dtos/userDto';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';

@WebSocketGateway({ cors: true })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
    @InjectRepository(Users)
    private authRepository: Repository<Users>
    ){}



  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('WebSocket server initialized!');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleRoomName(client: Socket, roomName: string): void {
    console.log('Room name received:', roomName);
    client.join(roomName); // Connect the client to the room
    this.server.to(roomName).emit('userJoined', `${client.id} joined the room`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket,  payload: { message: string, roomName: string, userName: string }): void {
    const { message, roomName, userName } = payload;
    console.log(message);
    client.join(roomName);
    this.server.to(roomName).emit('message', {message: message, userName: userName});
  }
}