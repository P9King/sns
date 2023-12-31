import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { BoardsModule } from './boards/boards.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/users.entity';
import { Boards } from './entities/boards.entity';
import { Files } from './entities/files.entity';
import { MyPageModule } from './my-page/my-page.module';
import { MulterModule } from '@nestjs/platform-express';
import { Likes } from './entities/likes.entity';
import { ChatModule } from './chat/chat.module';
import { ChatNames } from './entities/chatEntities/chatName.entity';
import { ChatMessages } from './entities/chatEntities/chatMassages.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Users, Boards, Files, Likes, ChatNames, ChatMessages],
      synchronize: true,
    }),
    AuthModule,
    BoardsModule,
    MyPageModule,
    MulterModule.register({
      dest: './src/public/uploads',
    }), 
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, ConfigService],
})
export class AppModule { }
