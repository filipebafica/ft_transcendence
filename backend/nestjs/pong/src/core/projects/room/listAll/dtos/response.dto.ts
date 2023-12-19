import RoomByParticipantDTO from "../../listByUserId/dtos/room.by.participant.dto";
import RoomDTO from "../../shared/dtos/room.dto";

export  class ResponseDTO {
    constructor(
        public readonly rooms: RoomDTO[]
    ) {
    }
}