import { Body, Controller, Get, Post, Req, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UserDto } from 'src/dtos/userDto';
import { ReturnStatus } from 'src/enum.status';
import { AuthGuard } from './guards/auth.guard';
import { Users } from 'src/entities/users.entity';


@Controller('api/auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }


    @Post('signup')
    signUp(@Body()userDto: UserDto): Promise<ReturnStatus> {
        return this.authService.signup(userDto)
    }

    @Post('login')
    login(@Body()userDto: UserDto): Promise<Array<Users|string> | ReturnStatus> {
        console.log(userDto);
        return this.authService.login(userDto);
    }

}
