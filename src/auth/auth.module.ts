import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { Boards } from 'src/entities/boards.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users, Boards]),
    JwtModule.register({
      global: true,
      secret: 'secretKey',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
