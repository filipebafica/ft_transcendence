import RoomByOneUserIdDTO from "./room.by.one.user.id.dto";

export class ResponseDTO {
    constructor(
        public readonly room: RoomByOneUserIdDTO
    ) {
    }
}