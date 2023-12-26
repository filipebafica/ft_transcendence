export default interface RoomMutedUserGateway {
    mute(
        userId: number,
        roomId: number,
        muteTimeoutAt: Date
    ): Promise<void>;

    unmute(
        userId: number,
        roomId: number
    ): Promise<void>;
}