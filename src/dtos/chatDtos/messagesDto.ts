import { ChatNames } from "src/entities/chatEntities/chatName.entity";
import { Users } from "src/entities/users.entity";

export class MessageDto {
    id: number;
    message: string;
    users: Users;
    roomName: ChatNames
}