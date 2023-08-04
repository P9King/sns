import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Boards } from 'src/entities/boards.entity';
import { MulterModule } from '@nestjs/platform-express';
import { Files } from 'src/entities/files.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Boards, Files]),
],
  controllers: [BoardsController],
  providers: [BoardsService]
})
export class BoardsModule { }
