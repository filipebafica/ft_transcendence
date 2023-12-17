export default interface StatusGateway {
    create(
        userId: number,
        newStatus: string
    );
}