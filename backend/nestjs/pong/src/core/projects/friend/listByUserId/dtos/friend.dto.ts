export default class FriendDTO {
    constructor(
        public readonly id: number,
        public readonly nickName: string,
        public readonly userStatus?: string,
        public readonly isBlocked?: boolean
    ) {
    }
}