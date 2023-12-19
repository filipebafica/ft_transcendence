import { Logger } from '@nestjs/common';
import BanRule from './rules/ban.rule';
import { RequestDTO } from './dtos/request.dto';
import GetRoomRule from './rules/get.room';
import BanValidationRule from './rules/ban.validation.rule';
import RoomGateway from '../shared/gateways/room.gateway';
import RoomBannedUserGateway from '../shared/gateways/room.user.banned.gateway';

export class BanUserService {
    private getRoom:           GetRoomRule;
    private banValidationRule: BanValidationRule;
    private banRule:           BanRule;

    constructor(
        private readonly logger: Logger,
        roomGateway:             RoomGateway,
        roomBannedUserGateway: RoomBannedUserGateway,
    ) {
        this.getRoom = new GetRoomRule(roomGateway);
        this.banValidationRule = new BanValidationRule();
        this.banRule = new BanRule(roomBannedUserGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            let room = await this.getRoom.apply(requestDTO.roomId);

            this.banValidationRule.appy(
                requestDTO.bannerUserId,
                requestDTO.bannedUserId,
                room
            );
            
            await this.banRule.apply(
                requestDTO.bannedUserId,
                requestDTO.roomId
            );

            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.bannedUserId} has been banned from room ${requestDTO.roomId}`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
