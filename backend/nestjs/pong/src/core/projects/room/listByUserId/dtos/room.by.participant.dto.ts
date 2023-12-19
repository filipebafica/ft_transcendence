export default class RoomByParticipantDTO {
    constructor(
        public readonly id: number,
        public readonly name: string,
        public readonly isOwner: boolean,
        public readonly isAdmin: boolean
    ) {
    }
}