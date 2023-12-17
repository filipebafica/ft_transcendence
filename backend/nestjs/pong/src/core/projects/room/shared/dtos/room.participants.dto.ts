import UserDTO from "./user.dto";

export default class RoomParticipantsDTO {
    constructor(
        public readonly id: number,
        public readonly isOwner: boolean,
        public readonly isAdmin: boolean,
        public readonly user: UserDTO
    ) {
    }
}