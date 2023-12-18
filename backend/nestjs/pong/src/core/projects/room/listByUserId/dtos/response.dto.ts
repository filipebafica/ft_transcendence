import RoomByParticipantDTO from "./room.by.participant.dto";

export class ResponseDTO {
    constructor(
        public readonly rooms: RoomByParticipantDTO[]
    ) {
    }
}