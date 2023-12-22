import { Logger } from '@nestjs/common';
import MuteRule from './rules/mute.rule';
import { RequestDTO } from './dtos/request.dto';
import GetRoomRule from './rules/get.room';
import MuteValidationRule from './rules/mute.validation.rule';
import RoomGateway from '../shared/gateways/room.gateway';
import RoomMutedUserGateway from '../shared/gateways/room.user.muted.gateway';

export class MuteUserService {
    private getRoom:           GetRoomRule;
    private muteValidationRule: MuteValidationRule;
    private muteRule:           MuteRule;

    constructor(
        private readonly logger: Logger,
        roomGateway:             RoomGateway,
        roomMutedUserGateway:    RoomMutedUserGateway
    ) {
        this.getRoom = new GetRoomRule(roomGateway);
        this.muteValidationRule = new MuteValidationRule();
        this.muteRule = new MuteRule(roomMutedUserGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const room = await this.getRoom.apply(requestDTO.roomId);

            this.muteValidationRule.appy(
                requestDTO.muterUserId,
                requestDTO.mutedUserId,
                room
            );

            await this.muteRule.apply(
                requestDTO.mutedUserId,
                requestDTO.roomId,
                requestDTO.muteTme
            );

            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.mutedUserId} has been muted from room ${requestDTO.roomId}`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
