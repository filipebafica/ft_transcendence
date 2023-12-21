import { Logger } from '@nestjs/common';
import JoinRule from './rules/join.rule';
import RoomParticipantsGateway from '../shared/gateways/room.participants.gateways';
import { RequestDTO } from './dtos/request.dto';
import { ResponseDTO } from './dtos/response.dto';
import IsUserBannedRule from './rules/isUserBanned.rule';
import RoomBannedUserGateway from '../shared/gateways/room.user.banned.gateway';
import { UserIdBannedException } from './exceptions/user.is.banned.exception';

export class JoinService {
    private joinRule: JoinRule;
    private isUserBannedRule: IsUserBannedRule;

    constructor(
        private readonly logger: Logger,
        roomPartipantsGatway: RoomParticipantsGateway,
        roomBannedUserGateway: RoomBannedUserGateway,

    ) {
        this.joinRule = new JoinRule(roomPartipantsGatway);
        this.isUserBannedRule = new IsUserBannedRule(roomBannedUserGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            if (await this.isUserBannedRule.apply(
                requestDTO.userId,
                requestDTO.roomId,
            )) {
                throw new UserIdBannedException(
                    requestDTO.userId,
                    requestDTO.roomId,
                );
            }

            await this.joinRule.apply(
                requestDTO.userId,
                requestDTO.roomId,
                requestDTO.isOwner,
                requestDTO.isAdamin
            );
            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.userId} has joined room ${requestDTO.roomId}`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
