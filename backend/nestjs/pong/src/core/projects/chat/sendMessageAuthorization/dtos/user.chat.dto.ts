export default class UserChatDTO {
    constructor (
        public readonly userId: number,
        public readonly blockedUsers: Array<number>
    ) {
    }
}