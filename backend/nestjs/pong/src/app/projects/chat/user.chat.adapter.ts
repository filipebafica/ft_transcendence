import { Injectable } from "@nestjs/common";
import UserChatDTO from "src/core/projects/chat/sendMessageAuthorization/dtos/user.chat.dto";
import UserChatGateway from "src/core/projects/chat/sendMessageAuthorization/gateways/user.chat.gateway";

@Injectable()
export default class UserChatAdapter implements UserChatGateway {
    getUserChat(userId: number): UserChatDTO {
        return new UserChatDTO(
            userId,
            new Array<number>(1, 2, 3)
        );
    }
}