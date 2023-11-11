import { BoardStatus } from 'src/entities/boards.entity';

export interface BoardInfo {
  id: number;
  title: string;
  content: string;
  status: BoardStatus;
  file_attached: number;
  userId: number;
}
