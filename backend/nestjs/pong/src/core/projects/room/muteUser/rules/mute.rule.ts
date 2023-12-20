import RoomMutedUserGateway from "../../shared/gateways/room.user.muted.gateway";

export default class MuteRule {
    constructor(
        private readonly roomMutedUserGateway: RoomMutedUserGateway
    ) {
    }

    async apply(
        userId: number,
        roomId: number,
        muteTime: number
    ): Promise<void> {
        await this.roomMutedUserGateway.mute(
            userId,
            roomId,
            new Date(new Date().getTime() + muteTime * 60000)
        );
    }
}