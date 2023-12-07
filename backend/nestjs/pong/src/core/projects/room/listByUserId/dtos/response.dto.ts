import RoomDTO from "../../dependencies/dtos/room.dto";

export default class ResponseDTO {
    constructor(
        public readonly rooms: RoomDTO[]
    ) {
    }
}