import RoomPartitipantsDTO from "./room.participants.dto";

export class ResponseDTO {
    constructor(
        public readonly roomPartipants: RoomPartitipantsDTO
    ) {
    }
}