import UserChatGateway from "../../shared/user.chat.gateway";

export class BlockUserRule {
    constructor(
        private readonly userChatGateay: UserChatGateway
    ) {
    }

    async apply(blockerUserId: number, targetUserId: number) {
        await this.userChatGateay.create(blockerUserId, targetUserId);
    }
}