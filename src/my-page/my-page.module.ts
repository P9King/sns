import { Module } from '@nestjs/common';
import { MyPageController } from './my-page.controller';
import { MyPageService } from './my-page.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Boards } from 'src/entities/boards.entity';
import { Files } from 'src/entities/files.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Boards, Files])
  ],
  controllers: [MyPageController],
  providers: [MyPageService]
})
export class MyPageModule {}
