import RoomByUserIdDTO from "../../shared/dtos/room.by.user.id.dto";
import RoomDTO from "../../shared/dtos/room.dto";
import RoomGateway from "../../shared/gateways/room.gateway";

export default class GetRoomsRule {
    constructor(
        private readonly roomGateway: RoomGateway
    ) {
    }

    async apply(userId: number): Promise<RoomByUserIdDTO[]> {
        return await this.roomGateway.getAllByUserId(userId);
    }

}