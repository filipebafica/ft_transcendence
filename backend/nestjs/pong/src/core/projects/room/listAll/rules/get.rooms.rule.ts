import RoomDTO from "../../shared/dtos/room.dto";
import RoomGateway from "../../shared/gateways/room.gateway";

export default class GetRoomsRule {
    constructor(
        private readonly roomGateway: RoomGateway
    ) {
    }

    apply(): Promise<RoomDTO[]> {
        return this.roomGateway.get();
    }
}