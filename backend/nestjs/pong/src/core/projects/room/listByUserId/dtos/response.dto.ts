import RoomDTO from "../../shared/dtos/room.dto";

export class ResponseDTO {
    constructor(
        public readonly rooms: RoomDTO[]
    ) {
    }
}