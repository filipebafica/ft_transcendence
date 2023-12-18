
export default interface RoomParticipantsGateway {
    join(
        userId: number,
        roomId: number,
        isOwner: boolean,
        isAdamin: boolean
    ): Promise<void>;

    remove(
        userId: number,
        roomId: number
    ): Promise<void>;
}