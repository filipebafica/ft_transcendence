import RoomByUserIdDTO from "../../shared/dtos/room.by.user.id.dto";
import RoomDTO from "../../shared/dtos/room.dto";

export  class ResponseDTO {
    constructor(
        public readonly rooms: RoomDTO[]
    ) {
    }
}