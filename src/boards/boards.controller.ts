import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Boards } from 'src/entities/boards.entity';
import { BoardsDto } from 'src/dtos/boardsDto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Files } from 'src/entities/files.entity';

@Controller('api/boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  @Post('postBoard')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: '../front/public/images', // Change the destination to your desired directory
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const extenstion = file.originalname.split('.')[1];
          //const savedFileName = `${name}_${Date.now()}.${extenstion}}`;
          const savedFileName =
            name.split('.').join('_') + '_' + Date.now() + '.' + extenstion;
          cb(null, savedFileName);
        },
      }),
    }),
  )
  postBoard(
    @Body() boardsDto: BoardsDto,
    @Req() userInfo,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    console.log('controller postBoard', boardsDto.status);
    console.log('co post board user', userInfo.user);
    console.log('postboard co', files);
    return this.boardsService.postBoard(
      { ...boardsDto, userId: userInfo.user.id },
      files,
    );
  }

  //for paging. get last board id
  @Post('getLatestBoards')
  getLastBoardId() {
    return this.boardsService.getLatestBoards();
  }

  //get all boards
  @Get('getAllBoards')
  getAllPost(
    @Query('page') page: number,
    @Query('boardId') boardId: number,
  ): Promise<Boards[]> {
    return this.boardsService.getAllBoards(page, boardId);
  }

  // get one board
  @UseGuards(AuthGuard)
  @Get('getOneBoardAndFiles')
  getOneBoardAndFiles(@Query('boardId') boardId: number) {
    return this.boardsService.getOneBoardAndFiles(boardId);
  }

  //get files
  @UseGuards(AuthGuard)
  @Get('getBoardFiles')
  getBoardFile(@Query('boardId') boardId: number): Promise<Files[]> {
    return this.boardsService.getBoardFiles(boardId);
  }

  //if로 작성자와 로그인 한 사람이 같은지 판별
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FilesInterceptor('file', 10, {
      storage: diskStorage({
        destination: '../front/public/images', // Change the destination to your desired directory
        filename: (req, file, cb) => {
          const name = file.originalname.split('.')[0];
          const extenstion = file.originalname.split('.')[1];
          const savedFileName =
            name.split('.').join('_') + '_' + Date.now() + '.' + extenstion;
          cb(null, savedFileName);
        },
      }),
    }),
  )

  //update board
  @Post('updateBoard')
  postUpdateBoard(
    @Query('boardId') boardId: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() boardsDto: BoardsDto,
    @Req() req,
  ) {
    return this.boardsService.updateBoard(boardsDto, req.user, files, boardId);
  }

  //delete board
  @UseGuards(AuthGuard)
  @Post('deleteBoard')
  deleteBoard(@Query('boardId') boardId: number, @Req() req) {
    console.log('boardid', boardId);
    return this.boardsService.deleteBoard(boardId, req.user);
  }

  //get like
  @UseGuards(AuthGuard)
  @Post('getOneBoardLike')
  getOneBoardLike(@Query('boardId') boardId: number, @Req() req) {
    return this.boardsService.getOneBoardLike(boardId, req.user);
  }

  //like
  @UseGuards(AuthGuard)
  @Post('likeBoard')
  likeBoard(@Query('boardId') boardId: number, @Req() req) {
    return this.boardsService.likeBoard(boardId, req.user);
  }

  //unlike
  @UseGuards(AuthGuard)
  @Post('unLikeBoard')
  unLikeBoard(@Query('boardId') boardId: number, @Req() req) {
    return this.boardsService.unLikeBoard(boardId, req.user);
  }
}
