import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatNames } from 'src/entities/chatEntities/chatName.entity';
import { Users } from 'src/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessages } from 'src/entities/chatEntities/chatMassages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatNames, Users, ChatMessages], ),
],
  providers: [ChatService, ChatGateway],
  controllers: [ChatController]
})
export class ChatModule {}
