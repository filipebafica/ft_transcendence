import RoomParticipantDTO from "./room.participant.dto";

export default class RoomDTO {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly isPublic: boolean,
        public readonly hasPassword?: boolean,
        public readonly participants?: Array<RoomParticipantDTO>
    ) {
    }
}