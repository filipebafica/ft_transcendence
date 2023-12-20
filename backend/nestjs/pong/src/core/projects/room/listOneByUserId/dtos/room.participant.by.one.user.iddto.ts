import UserDTO from "../../shared/dtos/user.dto";


export default class RoomParticipantByOneUserIdDTO {
    constructor(
        public readonly isOwner: boolean,
        public readonly isAdmin: boolean,
        public readonly isFriend?: boolean,
        public readonly isMuted?: boolean,
        public readonly status?: string,
        public readonly user?: UserDTO
    ) {
    }
}