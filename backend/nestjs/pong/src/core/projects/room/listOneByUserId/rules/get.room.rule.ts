import RoomGateway from "../../shared/gateways/room.gateway";
import RoomByOneUserIdDTO from "../dtos/room.by.one.user.id.dto";

export default class GetRoomRule {
    constructor(
        private readonly roomGateway: RoomGateway
    ) {
    }

    async apply(roomId: number, userId: number): Promise<RoomByOneUserIdDTO> {
        return await this.roomGateway.getOneByUserId(roomId, userId);
    }

}