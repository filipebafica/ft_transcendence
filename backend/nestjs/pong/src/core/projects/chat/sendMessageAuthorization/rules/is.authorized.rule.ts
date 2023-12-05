export default class IsAuthorizedRule {
    apply(receiverId: number, blockedUsers: Array<number>): boolean {

        return !blockedUsers.includes(receiverId);
    }
}