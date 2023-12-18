import { Logger } from '@nestjs/common';
import JoinRule from './rules/join.rule';
import RoomParticipantsGateway from '../shared/gateways/room.participants.gateways';
import { RequestDTO } from './dtos/request.dto';
import { ResponseDTO } from './dtos/response.dto';

export class JoinService {
    private joinRule: JoinRule;

    constructor(
        private readonly logger: Logger,
        roomPartipantsGatway: RoomParticipantsGateway
    ) {
        this.joinRule = new JoinRule(roomPartipantsGatway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

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
