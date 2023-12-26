import RoomParticipantsGateway from "../../shared/gateways/room.participants.gateway";

export default class RemoveRule {
    constructor(
        private readonly roomParticipantsGateway: RoomParticipantsGateway
    ) {
    }

    async apply(
        userId: number,
        roomId: number
    ): Promise<void> {
        await this.roomParticipantsGateway.remove(
            userId,
            roomId
        );
    }
}