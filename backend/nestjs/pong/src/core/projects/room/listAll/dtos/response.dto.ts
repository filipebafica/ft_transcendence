import RoomDTO from "./room.dto";

export default class ResponseDTO {
    constructor(
        public readonly rooms: RoomDTO[]
    ) {
    }
}