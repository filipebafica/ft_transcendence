import RoomDTO from "../../shared/dtos/room.dto";
import GetRoomsGateway from "../../shared/gateways/get.rooms.gateway";

export default class GetRoomsRule {
    constructor(
        private readonly getRoomsGateway: GetRoomsGateway
    ) {
    }

    apply(userId: number): Promise<RoomDTO[]> {
        return this.getRoomsGateway.getByUserId(userId);
    }

}