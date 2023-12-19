export default interface RoomBannedUserGateway {
    ban(
        userId: number,
        roomId: number
    ): Promise<void>;

    unban(
        userId: number,
        roomId: number
    ): Promise<void>;
}