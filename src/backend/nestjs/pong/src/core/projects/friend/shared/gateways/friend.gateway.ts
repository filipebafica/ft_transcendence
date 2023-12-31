import FriendDTO from "../../listByUserId/dtos/friend.dto";

export default interface FriendGateway {
    getByUserId(userId: number): Promise<FriendDTO[]>;

    create(
        userId: number,
        friedUserId?: number,
        friendNickName?: string,
    ): Promise<void>;

    delete(
        userId: number,
        friedUserId: number,
    ): Promise<void>;
}