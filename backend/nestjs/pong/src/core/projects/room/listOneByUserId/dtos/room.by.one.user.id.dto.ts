import RoomParticipantByOneUserIdDTO from "./room.participant.by.one.user.iddto";

export default class RoomByOneUserIdDTO {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly isPublic: boolean,
        public readonly participants?: Array<RoomParticipantByOneUserIdDTO>
    ) {
    }
}