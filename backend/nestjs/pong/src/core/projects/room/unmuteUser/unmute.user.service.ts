import { Logger } from '@nestjs/common';
import UnmuteRule from './rules/unmute.rule';
import { RequestDTO } from './dtos/request.dto';
import GetRoomRule from './rules/get.room';
import UnmuteValidationRule from './rules/unmute.validation.rule';
import RoomGateway from '../shared/gateways/room.gateway';
import RoomMutedUserGateway from '../shared/gateways/room.user.muted.gateway';

export class UnmuteUserService {
    private getRoom:              GetRoomRule;
    private unmuteValidationRule: UnmuteValidationRule;
    private unmuteRule:           UnmuteRule;

    constructor(
        private readonly logger: Logger,
        roomGateway:             RoomGateway,
        roomMutedUserGateway:    RoomMutedUserGateway
    ) {
        this.getRoom = new GetRoomRule(roomGateway);
        this.unmuteValidationRule = new UnmuteValidationRule();
        this.unmuteRule = new UnmuteRule(roomMutedUserGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const room = await this.getRoom.apply(requestDTO.roomId);

            this.unmuteValidationRule.appy(
                requestDTO.unmuterUserId,
                requestDTO.unmutedUserId,
                room
            );

            await this.unmuteRule.apply(
                requestDTO.unmutedUserId,
                requestDTO.roomId
            );

            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.unmutedUserId} has been unmuted in room ${requestDTO.roomId}`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
