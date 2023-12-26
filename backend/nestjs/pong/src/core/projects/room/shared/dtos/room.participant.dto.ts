import UserDTO from "./user.dto";

export default class RoomParticipantDTO {
    constructor(
        public readonly isOwner: boolean,
        public readonly isAdmin: boolean,
        public readonly isMuted: boolean,
        public readonly user?: UserDTO
    ) {
    }
}