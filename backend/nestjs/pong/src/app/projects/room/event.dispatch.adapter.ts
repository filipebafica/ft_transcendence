import EventDispatchGateway from "src/core/projects/room/shared/gateways/event.dispatch.gateway";
import { EventEmitter2 } from "@nestjs/event-emitter";

export default class EventDispatchAdapter implements EventDispatchGateway {
    static EVENT: string = 'room.participants.actionRouter';

    constructor(
        private readonly eventEmitter: EventEmitter2
    ) {
    }

    dispatch(
        roomId: number,
        userId: number,
        action: string,
        timeStamp: number
    ): void {

        this.eventEmitter.emit(
            EventDispatchAdapter.EVENT, JSON.stringify({
                room: roomId,
                user: userId,
                action: action,
                timeStamp: timeStamp
            })
        );
    }
}