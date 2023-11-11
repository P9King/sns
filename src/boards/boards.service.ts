import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardsDto } from 'src/dtos/boardsDto';
import { Boards } from 'src/entities/boards.entity';
import { Files } from 'src/entities/files.entity';
import { Likes } from 'src/entities/likes.entity';
import { Users } from 'src/entities/users.entity';
import { ReturnStatus } from 'src/enum.status';
import { Repository } from 'typeorm';
import { BoardInfo } from './interface';

@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(Boards)
    private boardsRepository: Repository<Boards>,

    @InjectRepository(Files)
    private filesRepository: Repository<Files>,

    @InjectRepository(Likes)
    private likesRepository: Repository<Likes>,
  ) {}

  async postBoard(boardInfo: BoardInfo, files: Array<Express.Multer.File>) {
    console.log('sv dto', boardInfo);
    console.log('sv files', files);

    //board entity
    const board: Boards = new Boards();
    board.title = boardInfo.title;
    board.content = boardInfo.content;
    board.status = boardInfo.status;

    if (files && files.length > 0) {
      board.file_attached = 1; // file attachment

      const postedBaord = await this.boardsRepository.save(board);

      for (let i: number = 0; i < files.length; i++) {
        const file = new Files();
        file.originalName = files[i].originalname;
        file.storedName = files[i].filename;
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

  //for paging boardId
  async getLatestBoards() {
    const limit = 5;
    const latestBoards = await this.boardsRepository
      .createQueryBuilder('boards')
      .select('boards')
      .orderBy('boards.id', 'DESC')
      .take(limit)
      .getMany();

    console.log('last board id ? : ', latestBoards);
    return latestBoards;
  }

  //get all boards
  async getAllBoards(page: number, boardId: number): Promise<Boards[]> {
    const limit = 5;
    const skip = (page - 1) * limit;

    const allBoards = await this.boardsRepository
      .createQueryBuilder('board')
      .where('board.id <= :boardId', { boardId })
      .orderBy('board.id', 'DESC')
      .take(limit) // take : 결과 집합에 포함되어야 하는 최대 레코드 수
      .skip(skip) // offset 역할
      .getMany();

    console.log('all boards for scrolling', allBoards);

    return allBoards;
  }

  // get one board with files
  async getOneBoard(boardId: number): Promise<Boards> {
    const getBoard = await this.boardsRepository.findOne({
      where: {
        id: boardId,
      },
    });
    console.log('sv g o b', getBoard);
    return getBoard;
  }

  // get files related to the board
  async getOneBoardAndFiles(
    boardId: number,
  ): Promise<{ board: BoardsDto; files?: Files[] }> {
    const board = new Boards(); //객체 구성요소는 수정가능
    board.id = boardId;
    const getBoard = await this.boardsRepository.findOne({
      where: {
        id: board.id,
      },
    });

    console.log('this is getBoard.files ', getBoard.files);

    //save board into return
    const payload = {
      board: getBoard,
    };

    if (getBoard.file_attached !== 1) {
      return payload;
    }

    const files = await this.filesRepository.find({
      where: {
        boards: board,
      },
    });

    return {
      ...payload,
      files: files,
    };
  }

  //get files
  async getBoardFiles(boardId: number): Promise<Files[]> {
    const board = new Boards();
    board.id = boardId;
    const files = await this.filesRepository.find({
      where: {
        boards: board,
      },
    });

    return files;
  }

  async updateBoard(
    boarsdDto: BoardsDto,
    userInfo: Users,
    files: Express.Multer.File[],
    boardId: number,
  ) {
    const board = await this.getOneBoard(boardId);

    if (board.users.id !== userInfo.id) {
      return ReturnStatus.FAILURE;
    }

    board.id = boardId;
    board.title = boarsdDto.title;
    board.content = boarsdDto.content;
    board.status = boarsdDto.status;
    board.users = userInfo;

    await this.boardsRepository.update({ id: board.id }, board);
    const boardIdForFile = new Boards();
    boardIdForFile.id = boardId;
    const deleteFiles = await this.filesRepository.find({
      where: {
        boards: boardIdForFile,
      },
    });

    // 기존 파일 개수와 업데이트할 파일 개수가 다르면 조절 하기 불편해짐 -> 삭제하고 다시 저장하는 방식으로 채택
    const deleteFileIds = deleteFiles.map((date) => date.id);
    await this.filesRepository.delete(deleteFileIds);

    await this.filesRepository.save(files as any[]);

    return ReturnStatus.SUCCESS;
  }

  //delete
  async deleteBoard(boardNo: number, user: Users) {
    const board = await this.getOneBoard(boardNo);

    if (board.users.id !== user.id) {
      return ReturnStatus.FAILURE;
    }

    const deleteResult = await this.boardsRepository.delete(board.id);

    return deleteResult.raw;
  }

  /**
   * like board
   */
  async getOneBoardLike(boardId: number, users: Users) {
    const board = new Boards();
    const user = new Users();

    board.id = boardId;
    user.id = users.id;

    return this.likesRepository.findOne({
      where: {
        boards: board,
        users: user,
      },
    });
  }

  //like a board
  async likeBoard(boardId: number, users: Users) {
    const board = new Boards();
    const user = new Users();

    board.id = boardId;
    user.id = users.id;

    await this.likesRepository.save({
      boards: board,
      users: user,
    });

    const likeUpBoard = await this.boardsRepository
      .createQueryBuilder()
      .update(Boards)
      .set({ like: () => 'like + 1' })
      .where('id = :id', { id: board.id })
      .execute();

    return likeUpBoard.raw;
  }

  //unlike a board
  async unLikeBoard(boardId: number, users: Users) {
    const board = new Boards();
    const user = new Users();

    board.id = boardId;
    user.id = users.id;

    const like = await this.likesRepository.delete({
      boards: board,
      users: user,
    });

    const unLikeUpBoard = await this.boardsRepository
      .createQueryBuilder()
      .update(Boards)
      .set({ like: () => 'like - 1' })
      .where('id = :id', { id: board.id })
      .execute();

    return unLikeUpBoard.raw;
  }
}
