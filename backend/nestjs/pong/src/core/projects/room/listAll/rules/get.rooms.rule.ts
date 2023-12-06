import RoomDTO from "../dtos/room.dto";
import GetRoomsGateway from "../gateways/get.rooms.gateway";

export default class GetRoomsRule {
    constructor(
        private readonly getRoomsGateway: GetRoomsGateway
    ) {
    }

    apply(): RoomDTO[] {
        return this.getRoomsGateway.get();
    }

}