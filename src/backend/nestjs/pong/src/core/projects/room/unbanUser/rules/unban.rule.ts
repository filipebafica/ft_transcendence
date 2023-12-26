import RoomBannedUserGateway from "../../shared/gateways/room.user.banned.gateway";

export default class UnbanRule {
    constructor(
        private readonly roomBannedUserGateway: RoomBannedUserGateway
    ) {
    }

    async apply(
        userId: number,
        roomId: number
    ): Promise<void> {
        await this.roomBannedUserGateway.unban(
            userId,
            roomId
        );
    }
}