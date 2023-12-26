import RoomMutedUserGateway from "../../shared/gateways/room.user.muted.gateway";

export default class UnmuteRule {
    constructor(
        private readonly roomMutedUserGateway: RoomMutedUserGateway
    ) {
    }

    async apply(
        userId: number,
        roomId: number
    ): Promise<void> {
        await this.roomMutedUserGateway.unmute(
            userId,
            roomId
        )
    }
}