import { Logger } from '@nestjs/common';
import RemoveRule from './rules/remove.rule';
import { RequestDTO } from './dtos/request.dto';
import RoomParticipantsGateway from '../shared/gateways/room.participants.gateway';
import GetRoomRule from './rules/get.room';
import RemotionValidationRule from './rules/remotion.validation.rule';
import RoomGateway from '../shared/gateways/room.gateway';
import EventDispatchRule from './rules/event.dispatch.rule';
import EventDispatchGateway from '../shared/gateways/event.dispatch.gateway';

export class RemoveUserService {
    private getRoom:                GetRoomRule;
    private remotionValidationRule: RemotionValidationRule;
    private removeRule:             RemoveRule;
    private eventDispatchRule:      EventDispatchRule;

    constructor(
        private readonly logger: Logger,
        roomGateway:             RoomGateway,
        roomParticipantsGateway: RoomParticipantsGateway,
        eventDispatchGateway:    EventDispatchGateway
    ) {
        this.getRoom = new GetRoomRule(roomGateway);
        this.remotionValidationRule = new RemotionValidationRule();
        this.removeRule = new RemoveRule(roomParticipantsGateway);
        this.eventDispatchRule = new EventDispatchRule(eventDispatchGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const room = await this.getRoom.apply(requestDTO.roomId);

            this.remotionValidationRule.appy(
                requestDTO.removerUserId,
                requestDTO.removedUserId,
                room
            );
            
            await this.removeRule.apply(
                requestDTO.removedUserId,
                requestDTO.roomId
            );

            this.eventDispatchRule.apply(
                requestDTO.roomId,
                requestDTO.removedUserId
            );

            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.removedUserId} has been removed from room ${requestDTO.roomId}`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
