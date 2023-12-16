import RoomDTO from "../../shared/dtos/room.dto";
import RoomGateway from "../../shared/gateways/room.gateway";

export default class GetRoomsRule {
    constructor(
        private readonly roomGateway: RoomGateway
    ) {
    }

    async apply(userId: number): Promise<RoomDTO[]> {
        return await this.roomGateway.getByUserId(userId);
    }

}