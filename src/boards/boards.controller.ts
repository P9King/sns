import { Body, Controller, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Boards } from 'src/entities/boards.entity';
import { BoardsDto } from 'src/dtos/boardsDto';
import { ReturnStatus } from 'src/enum.status';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { Files } from 'src/entities/files.entity';


@Controller('api/boards')
export class BoardsController {
    constructor(
        private boardsService: BoardsService,

    ) { }


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
                    const savedFileName = name.split('.').join("_") + "_" + Date.now() + "." + extenstion
                    cb(null, savedFileName);
                },
            }),
        }),
    )
    postBoard(@Body() boardsDto: BoardsDto, @Req() userInfo, @UploadedFiles() files: Array<Express.Multer.File>) {
        console.log("controller postBoard", boardsDto.status);
        console.log("co post board user", userInfo.user);
        console.log("postboard co", files);
        boardsDto.users = userInfo.user.id;
        return this.boardsService.postBoard(boardsDto, files);

    }
    
    //for paging. get last board id
    @Post('getLatestBoards')
    getLastBoardId(){
        return this.boardsService.getLatestBoards();
    }

    //get all boards
    @Get('getAllBoards')
    getAllPost(@Query('page') page: number,  @Query('boardId') boardId: number): Promise<Boards[]> {
        console.log("page : ", page, "boardId : ", boardId);
        return this.boardsService.getAllBoards(page, boardId);
    }

    // get one board
    @UseGuards(AuthGuard)
    @Get('getOneBoardAndFiles')
    getOneBoardAndFiles(@Query('boardId') boardId: number): Promise<{ board: BoardsDto; files?: Files[] }> {
        console.log("co params", boardId);
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
                    const savedFileName = name.split('.').join("_") + "_" + Date.now() + "." + extenstion
                    cb(null, savedFileName);
                },
            }),
        }),
    )

    //update board
    @Post('updateBoard')
    postUpdateBoard(@Query('boardId') boardId: number, @UploadedFiles() files: Array<Express.Multer.File>, @Body() boardsDto: BoardsDto, @Req() req) {
        console.log("co update", boardId);
        console.log("files", files);
        console.log("co update user", req.user);
        console.log("co update dto", boardsDto);

        return this.boardsService.updateBoard(boardsDto, req.user, files, boardId);
    }

    //delete board
    @UseGuards(AuthGuard)
    @Post('deleteBoard')
    deleteBoard(@Query('boardId') boardId: number, @Req() req) {
        console.log("boardid", boardId);
        return this.boardsService.deleteBoard(boardId, req.user);
    }

    //like sections//
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
