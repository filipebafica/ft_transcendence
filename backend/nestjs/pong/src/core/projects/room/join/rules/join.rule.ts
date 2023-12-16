import RoomParticipantsGateway from "../../shared/gateways/room.participants.gateways";
import RoomPartitipantsDTO from "../dtos/room.participants.dto";

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
    ): Promise<RoomPartitipantsDTO> {
        return await this.roomParticipantsGateway.join(
            userId,
            roomId,
            isOwner,
            isAdamin
        );
    }
}