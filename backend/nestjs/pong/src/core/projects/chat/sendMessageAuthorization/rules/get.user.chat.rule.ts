import UserChatDTO from "../dtos/user.chat.dto";
import UserChatGateway from "../gateways/user.chat.gateway";

export default class GetUserChatRule {
    constructor(
        private readonly userChatGateay: UserChatGateway
    ) {
    }

    async apply(userId: number): Promise<Array<number>> {
        return await this.userChatGateay.getUserChat(userId);
    }
}