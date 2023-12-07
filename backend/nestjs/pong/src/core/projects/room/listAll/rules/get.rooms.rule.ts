import RoomDTO from "../../dependencies/dtos/room.dto";
import GetRoomsGateway from "../../dependencies/gateways/get.rooms.gateway";

export default class GetRoomsRule {
    constructor(
        private readonly getRoomsGateway: GetRoomsGateway
    ) {
    }

    apply(): RoomDTO[] {
        return this.getRoomsGateway.get();
    }

}