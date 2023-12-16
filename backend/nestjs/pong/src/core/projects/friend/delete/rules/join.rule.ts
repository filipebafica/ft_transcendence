import FriendGateway from "../../shared/gateways/friend.gateway";

export default class DeleteRule {
    constructor(
        private readonly friendGateway: FriendGateway
    ) {
    }

    async apply(
        userId: number,
        roomId: number,
    ) {
        return await this.friendGateway.delete(
            userId,
            roomId
        );
    }
}