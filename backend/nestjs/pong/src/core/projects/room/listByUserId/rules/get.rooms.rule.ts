import RoomByParticipantDTO from "../dtos/room.by.participant.dto";
import RoomDTO from "../../shared/dtos/room.dto";
import RoomGateway from "../../shared/gateways/room.gateway";

export default class GetRoomsRule {
    constructor(
        private readonly roomGateway: RoomGateway
    ) {
    }

    async apply(userId: number): Promise<RoomByParticipantDTO[]> {
        return await this.roomGateway.getByUserId(userId);
    }

}