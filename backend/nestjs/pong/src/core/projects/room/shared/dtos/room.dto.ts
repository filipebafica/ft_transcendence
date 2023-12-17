import RoomParticipantsDTO from "./room.participants.dto";

export default class RoomDTO {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly participants?: Array<RoomParticipantsDTO>
    ) {
    }
}