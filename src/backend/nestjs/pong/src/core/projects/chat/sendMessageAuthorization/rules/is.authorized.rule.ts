import UserChatDTO from "../dtos/user.chat.dto";

export default class IsAuthorizedRule {
    apply(senderId: number, receiverBlockedUsers: Array<number>): boolean {

        console.log(receiverBlockedUsers);
        return !receiverBlockedUsers.includes(senderId);
    }
}