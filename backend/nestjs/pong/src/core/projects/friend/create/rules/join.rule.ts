import FriendGateway from "../../shared/gateways/friend.gateway";

export default class CreateRule {
    constructor(
        private readonly friendGateway: FriendGateway
    ) {
    }

    async apply(
        userId: number,
        roomId: number,
    ) {
        return await this.friendGateway.create(
            userId,
            roomId
        );
    }
}