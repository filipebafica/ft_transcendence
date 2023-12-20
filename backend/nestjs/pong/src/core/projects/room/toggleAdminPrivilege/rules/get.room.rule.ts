import RoomDTO from "../../shared/dtos/room.dto";
import RoomGateway from "../../shared/gateways/room.gateway";

export default class GetRoomRule {
    constructor (
        private readonly roomGateway: RoomGateway
    ) {
    }

    async apply(roomId: number): Promise<RoomDTO> {
        return await this.roomGateway.getByRomId(roomId);
    }
}
