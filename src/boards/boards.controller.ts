import { Body, Controller, Get, Param, Post, Query, Req, UploadedFiles, UseGuards, UseInterceptors, } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Boards } from 'src/entities/boards.entity';
import { BoardsDto } from 'src/dtos/boardsDto';
import { ReturnStatus } from 'src/enum.status';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';


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
            destination: '../../public/uploads', // Change the destination to your desired directory
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
    postBoard(@Body() boardsDto:BoardsDto, @Req() userInfo, @UploadedFiles() files: Array<Express.Multer.File>) {
        console.log("controller postBoard",boardsDto.status);
        console.log("co post board user", userInfo.user);
        console.log("postboard co", files);
        boardsDto.users = userInfo.user.id;
        this.boardsService.postBoard(boardsDto, files);
    }




    @Get('/getAllBoards')
    getAllPost() {
        return this.boardsService.getAllBoards();
    }

    //if you are not writter, readonly or not you can update
    @UseGuards(AuthGuard)
    @Get('getOneboard')
    getOneBoard(@Query('boardNo') boardNo: number): Promise<Boards> {
        console.log("co params", boardNo);
        return this.boardsService.getOneBoard(boardNo);
    }

    @UseGuards(AuthGuard)
    @Get('getUpdateBoard')
    getUpdateBoard(@Query('boardNo') boardNo: number, @Req() req){
        console.log("co getupdate boardNo", boardNo);
        return this.boardsService.getUpdateBoard(boardNo, req.user);
    }


    //if로 작성자와 로그인 한 사람이 같은지 판별
    @UseGuards(AuthGuard)
    @Post('updateBoard')
    postUpdateBoard(@Body() boardsDto: BoardsDto, @Req() req) {
        console.log("co update",boardsDto);
       
        if (req.user.id !== boardsDto.users.id) {
            return ReturnStatus.FAILURE;

        } else if (req.user.id === boardsDto.id) {
            return this.boardsService.updateBoard(boardsDto, req.user);
        }
       
    }

    @UseGuards(AuthGuard)
    @Post('deleteBoard')
    deleteBoard(@Query('boardNo') boardNo: number, @Req() req){
        return this.boardsService.deleteBoard(boardNo, req.user);
    }


}
