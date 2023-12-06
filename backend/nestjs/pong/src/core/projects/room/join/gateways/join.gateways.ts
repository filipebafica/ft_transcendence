export default interface JoinGateway {
    join(userId: number, roomId: number): void;
}