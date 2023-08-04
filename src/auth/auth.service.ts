import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto } from 'src/dtos/userDto';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ReturnStatus } from 'src/enum.status';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(Users)
        private authRepository: Repository<Users>,
        private jwtService: JwtService
    ) { }


    //sign up
    async signup(userDto: UserDto): Promise<ReturnStatus> {
        console.log("service signup userdto",userDto);
        const takenEmail = await this.authRepository.findOne({ where: { email: userDto.email } });
        if (takenEmail) {
            return ReturnStatus.FAILURE;
        } else {

            const salt = await bcrypt.genSalt();
            const password = userDto.password;
            const hashedPassword = await bcrypt.hash(password, salt);
            userDto.password = hashedPassword;

            //dto -> entity
            const user = new Users
            user.email = userDto.email;
            user.name = userDto.name;
            user.password = hashedPassword;

            this.authRepository.save(user)
            return ReturnStatus.SUCCESS;
        }
    }

    //login
    async login(userDto: UserDto): Promise<string> {
        console.log("ser log", userDto)
        const user = await this.authRepository.findOne({where:{email: userDto.email}});
        console.log(user);

        console.log("compare",await bcrypt.compare(userDto.password, user.password));

        if(user && (await bcrypt.compare(userDto.password, user.password))){
            const userPayload = {
                id: user.id,
                email : user.email,
                name : user.name
            }
            const accessToken = await this.jwtService.signAsync(userPayload);
            return accessToken
        }else {
            return ReturnStatus.FAILURE;
        }

    }

}
