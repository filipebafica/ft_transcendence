import RoomDTO from "../../shared/dtos/room.dto";

export default class ResponseDTO {
    constructor(
        public readonly rooms: RoomDTO[]
    ) {
    }
}