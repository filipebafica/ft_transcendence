import RoomDTO from "../../dependencies/dtos/room.dto";
import GetRoomsGateway from "../../dependencies/gateways/get.rooms.gateway";

export default class GetRoomsRule {
    constructor(
        private readonly getRoomsGateway: GetRoomsGateway
    ) {
    }

    apply(userId: number): RoomDTO[] {
        return this.getRoomsGateway.getByUserId(userId);
    }

}