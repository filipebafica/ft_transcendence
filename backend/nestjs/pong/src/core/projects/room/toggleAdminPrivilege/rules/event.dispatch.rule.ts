import EventDispatchGateway from "../../shared/gateways/event.dispatch.gateway";

export default class EventDispatchRule {
    static ACTION: string = 'USER_HAS_ADMIN_PRIVILEGE_CHANGED_IN_ROOM';

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