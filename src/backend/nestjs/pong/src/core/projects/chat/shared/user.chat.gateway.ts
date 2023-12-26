
export default interface UserChatGateway {
    get(userId: number): Promise<Array<number>>;
    create(blockerUserId: number, targetUserId: number);
    delete(unBlockerUserId: number, targetUserId: number): Promise<void>;
}
