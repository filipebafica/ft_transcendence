import UserChatGateway from "../../shared/user.chat.gateway";

export class UnblockUserRule {
	constructor(
		private readonly userChatGateway: UserChatGateway
	) {
	}

	async apply(unBlockerUserId: number, targetUserId: number) {
		await this.userChatGateway.delete(unBlockerUserId, targetUserId);
	}
}
