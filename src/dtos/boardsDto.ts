import { BoardStatus } from 'src/entities/boards.entity';
import { Users } from 'src/entities/users.entity';

export class BoardsDto {
  id: number;

  title: string;

  content: string;

  status: BoardStatus;

  file_attached: number;

  users: Users;
}
