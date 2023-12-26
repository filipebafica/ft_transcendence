export default class UserChatDTO {
    constructor (
        public readonly id: number,
        public readonly userId: number,
        public readonly blockedUser: number,
    ) {
    }
}