import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsDto } from 'src/dtos/boardsDto';
import { Boards } from 'src/entities/boards.entity';
import { Users } from 'src/entities/users.entity';
import { ReturnStatus } from 'src/enum.status';
import { Repository } from 'typeorm';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Boards)
        private boardsRepository: Repository<Boards>
    ) { }

    async postBoard(boardsDto: BoardsDto, files: Array<Express.Multer.File>) {
        console.log("sv dto", boardsDto);
        console.log("sv files", files);
    

        if (files && files.length > 0) {
            const board: Boards = new Boards
            board.title = boardsDto.title;
            board.content = boardsDto.content;
            board.status = boardsDto.status;
            board.users = boardsDto.users;
            board.file_attached = 1; // file attachment



             await this.boardsRepository.save(boardsDto);
        } else {
            const board: Boards = new Boards
            board.title = boardsDto.title;
            board.content = boardsDto.content;
            board.status = boardsDto.status;
            board.users = boardsDto.users;
            board.file_attached = 0; // file is not exist

            //await this.boardsRepository.save(board);
        }
    }

    async getAllBoards() {
        const allBoards = await this.boardsRepository.find();
        return allBoards;

    }

    async getOneBoard(boardNo: number): Promise<Boards> {
        const board = new Boards
        board.id = boardNo;
        const getBoard = await this.boardsRepository.findOne({
            where: {
                id: board.id
            }
        })
        console.log("sv g o b", getBoard);
        return getBoard;
    }


    async getUpdateBoard(boardNo: number, userInfo) {
        console.log("sv getUpdateBoard", userInfo);
        const boardInfo = await this.getOneBoard(boardNo);
        console.log("boardInfo", boardInfo.users);

        if (userInfo.id !== boardInfo.users.id) {
            return ReturnStatus.FAILURE
        } else if (userInfo.id === boardInfo.users.id) {
            return ReturnStatus.SUCCESS //in front, render update page
        }


    }

    async updateBoard(boarsdDto: BoardsDto, userInfo: Users) {

        const board = new Boards
        board.id = boarsdDto.id;
        board.title = boarsdDto.title;
        board.content = boarsdDto.content;
        board.status = boarsdDto.status;
        board.users = boarsdDto.users;

        const update = await this.boardsRepository.update(
            board.id,
            {
                title: board.title,
                content: board.content,
                status: board.status,
            }
        );
        console.log(update);
        return update;
    }

    async deleteBoard(boardNo: number, user: Users) {
        console.log("service delete", boardNo);
        const board = await this.getOneBoard(boardNo);

        if (board.users.id === user.id) {
            const result = await this.boardsRepository.remove(board);
            return ReturnStatus.SUCCESS
        } else {
            return ReturnStatus.FAILURE
        }

    }


}
