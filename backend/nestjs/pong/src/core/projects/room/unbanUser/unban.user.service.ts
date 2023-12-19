import { Logger } from '@nestjs/common';
import UnbanRule from './rules/unban.rule';
import { RequestDTO } from './dtos/request.dto';
import GetRoomRule from './rules/get.room';
import UnbanValidationRule from './rules/unban.validation.rule';
import RoomGateway from '../shared/gateways/room.gateway';
import RoomBannedUserGateway from '../shared/gateways/room.user.banned.gateway';

export class UnbanUserService {
    private getRoom:           GetRoomRule;
    private unbanValidationRule: UnbanValidationRule;
    private unbanRule:           UnbanRule;

    constructor(
        private readonly logger: Logger,
        roomGateway:             RoomGateway,
        roomBannedUserGateway: RoomBannedUserGateway,
    ) {
        this.getRoom = new GetRoomRule(roomGateway);
        this.unbanValidationRule = new UnbanValidationRule();
        this.unbanRule = new UnbanRule(roomBannedUserGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            let room = await this.getRoom.apply(requestDTO.roomId);

            this.unbanValidationRule.appy(
                requestDTO.unbannerUserId,
                requestDTO.unbannedUserId,
                room
            );
            
            await this.unbanRule.apply(
                requestDTO.unbannedUserId,
                requestDTO.roomId
            );

            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.unbannedUserId} has been unbanned from room ${requestDTO.roomId}`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
