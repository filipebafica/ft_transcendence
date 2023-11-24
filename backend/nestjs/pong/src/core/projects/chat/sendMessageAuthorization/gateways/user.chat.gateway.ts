import UserChatDTO from "../dtos/user.chat.dto";

export default interface UserChatGateway {
    getUserChat(userId: number): UserChatDTO;
}