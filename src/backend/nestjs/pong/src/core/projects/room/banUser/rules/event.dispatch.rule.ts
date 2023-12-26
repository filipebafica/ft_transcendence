import EventDispatchGateway from "../../shared/gateways/event.dispatch.gateway";

export default class EventDispatchRule {
    static ACTION: string = 'USER_HAS_BEEN_BANNED_FROM_ROOM';

    constructor(
        private readonly eventDispatchGateway: EventDispatchGateway
    ) {
    }

    apply(
        roomId: number,
        userId: number
    ): void {
        this.eventDispatchGateway.dispatch(
            roomId,
            userId,
            EventDispatchRule.ACTION,
            Date.now()
        );
    }
}