
export default interface EventDispatchGateway {
    dispatch(
        roomId: number,
        userId: number,
        action: string,
        timeStamp: number
    ): void;
}
