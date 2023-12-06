export default interface RoomGateway {
    create(
        userId: number,
        roomName: string,
        type: string
    ): void;
}