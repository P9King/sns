import { BoardStatus } from 'src/entities/boards.entity';

export class BoardsDto {
  id: number;
  title: string;
  content: string;
  status: BoardStatus;
  file_attached: number;
}
