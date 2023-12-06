export default interface CreateGateway {
    create(
        userId: number,
        roomName: string,
        type: string
    ): void;
}