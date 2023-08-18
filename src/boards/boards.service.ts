import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsDto } from 'src/dtos/boardsDto';
import { Boards } from 'src/entities/boards.entity';
import { Files } from 'src/entities/files.entity';
import { Likes } from 'src/entities/likes.entity';
import { Users } from 'src/entities/users.entity';
import { ReturnStatus } from 'src/enum.status';
import { Repository } from 'typeorm';
import { BoardsModule } from './boards.module';

@Injectable()
export class BoardsService {
    constructor(
        @InjectRepository(Boards)
        private boardsRepository: Repository<Boards>,

        @InjectRepository(Users)
        private usersRepository: Repository<Users>,

        @InjectRepository(Files)
        private filesRepository: Repository<Files>,

        @InjectRepository(Likes)
        private likesRepository: Repository<Likes>
    ) { }

    async postBoard(boardsDto: BoardsDto, files: Array<Express.Multer.File>) {
        console.log("sv dto", boardsDto);
        console.log("sv files", files);

        //board entity
        const board: Boards = new Boards
        board.title = boardsDto.title;
        board.content = boardsDto.content;
        board.status = boardsDto.status;
        board.users = boardsDto.users;

        if (files && files.length > 0) {
            board.file_attached = 1; // file attachment

            const postedBaord = await this.boardsRepository.save(board);

            for (let i: number = 0; i < files.length; i++) {
                const file = new Files
                file.originalName = files[i].originalname;
                file.storedName = files[i].filename
                file.filePath = files[i].destination;
                file.boards = postedBaord;
                await this.filesRepository.save(file);
            }
            return ReturnStatus.SUCCESS;

        } else {
            board.file_attached = 0; // file is not exist
            await this.boardsRepository.save(board);
            return ReturnStatus.SUCCESS;
        }
    }

    //get all boards
    async getAllBoards() {
        const allBoards = await this.boardsRepository.find({ order: { createdAt: 'DESC' } });

        return allBoards;
    }

    // get one board with files 
    async getOneBoard(boardId: number): Promise<Boards> {
        const board = new Boards
        board.id = boardId;
        const getBoard = await this.boardsRepository.findOne({
            where: {
                id: board.id
            }
        })
        console.log("sv g o b", getBoard);
        return getBoard;
    }

    // get files related to the board
    async getOneBoardAndFiles(boardId: number): Promise<{ board: BoardsDto; files?: Files[] }> {
        const board = new Boards //객체 구성요소는 수정가능
        board.id = boardId;
        const getBoard = await this.boardsRepository.findOne({
            where: {
                id: board.id
            }
        })

        console.log("this is getBoard.files ", getBoard.files);

        //save board into return
        let payload: { board: Boards; files?: Files[] } = {
            board: getBoard
        };
        if (getBoard.file_attached === 1) {
            console.log('file_attached');

            const files = await this.filesRepository.find({
                where: {
                    boards: board
                }
            })

            console.log("filesssss?", files);

            payload = {
                ...payload,
                files: files
            }
            return payload;
        }
        return payload;
    }




    //get files
    async getBoardFiles(boardId: number): Promise<Files[]> {
        const board = new Boards
        board.id = boardId;
        console.log("이거 작동함?");
        const files = await this.filesRepository.find({
            where: {
                boards: board
            }
        })

        return files;
    }


    async updateBoard(boarsdDto: BoardsDto, userInfo: Users, files: Array<Express.Multer.File>, boardId: number) {
        const board = await this.getOneBoard(boardId);

        console.log("wrtier", board.users.id);
        console.log("login user info", userInfo.id);


        //prevent qery hacking
        if (board.users.id === userInfo.id) {
            console.log("writer and user is same person");

            board.id = boardId;
            board.title = boarsdDto.title;
            board.content = boarsdDto.content;
            board.status = boarsdDto.status;
            board.users = userInfo

            await this.boardsRepository.update({ id: board.id }, board);

            //file 
            // board id for finding files info 
            const boardIdForFile = new Boards
            boardIdForFile.id = boardId;
            const file = await this.filesRepository.find({
                where: {
                    boards: boardIdForFile
                }
            })

            //기존 파일 개수와 업데이트할 파일 개수가 다르면 조절 하기 불편해짐 -> 삭제하고 다시 저장하는 방식으로 채택
            //delete
            for (const deleteFiles of file) {
                const aaa = await this.filesRepository.remove(deleteFiles);
                console.log("delete fiels ", aaa);
            }

            //save
            for (const fileData of files) {
                const filesForUpdate = new Files();
                filesForUpdate.originalName = fileData.originalname;
                filesForUpdate.storedName = fileData.filename;
                filesForUpdate.filePath = fileData.destination;
                filesForUpdate.boards = boardIdForFile;
                const aa = await this.filesRepository.save(filesForUpdate);
                console.log("file updateed??", aa);
            }
            return ReturnStatus.SUCCESS
        } else {
            return ReturnStatus.FAILURE
        }
    }

    //delete
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

    //like section//
    //get likes 
    async getOneBoardLike(boardId: number, users: Users) {
        const board = new Boards;
        const user = new Users;

        board.id = boardId;
        user.id = users.id;

        const like = await this.likesRepository.findOne({
            where: {
                boards: board,
                users: user
            }
        });
        console.log("board service like ", like);
        return like ?? ReturnStatus.FAILURE;
    }

    //like a board
    async likeBoard(boardId: number, users: Users) {
        const board = new Boards;
        const user = new Users;

        board.id = boardId;
        user.id = users.id;

        const like = await this.likesRepository.save({
            boards: board,
            users: user
        });

        const likeUpBoard = await this.boardsRepository
        .createQueryBuilder()
        .update(Boards)
        .set({ like: () => "like + 1" }) // 컬럼:을 ()=> 하겟다는것
        .where("id = :id", { id: board.id }) //id = :id, {괄호값이 :id 안으로 들어가는것}
        .execute();
        console.log(like);
    }

    //unlike a board
    async unLikeBoard(boardId: number, users: Users) {
        const board = new Boards;
        const user = new Users;

        board.id = boardId;
        user.id = users.id;

        const like = await this.likesRepository.delete({
            boards: board,
            users: user
        });

        const unLikeUpBoard = await this.boardsRepository
        .createQueryBuilder()
        .update(Boards)
        .set({ like: () => "like - 1" }) // 컬럼:을 ()=> 하겟다는것
        .where("id = :id", { id: board.id }) //id = :id, {괄호값이 :id 안으로 들어가는것}
        .execute();
        console.log(like);
    }



}
