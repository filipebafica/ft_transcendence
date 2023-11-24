import UserChatDTO from "../dtos/user.chat.dto";
import UserChatGateway from "../gateways/user.chat.gateway";

export default class GetUserChatRule {
    constructor(
        private readonly userChatGateay: UserChatGateway
    ) {
    }

    apply(userId: number): UserChatDTO {
        return this.userChatGateay.getUserChat(userId);
    }
}