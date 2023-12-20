export default interface RoomMutedUserGateway {
    mute(
        userId: number,
        roomId: number,
        muteTime: number
    ): Promise<void>;

    unmute(
        userId: number,
        roomId: number
    ): Promise<void>;
}