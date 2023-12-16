import FriendDTO from "./friend.dto";

export class ResponseDTO {
    constructor(
        public readonly friends: FriendDTO[]
    ) {
    }
}