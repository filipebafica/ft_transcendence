import RoomParticipantsGateway from "../../shared/gateways/room.participants.gateway";

export default class JoinRule {
    constructor(
        private readonly roomParticipantsGateway: RoomParticipantsGateway
    ) {
    }

    async apply(
        userId: number,
        roomId: number,
        isOwner: boolean,
        isAdamin: boolean
    ): Promise<void> {
        await this.roomParticipantsGateway.join(
            userId,
            roomId,
            isOwner,
            isAdamin
        );
    }
}