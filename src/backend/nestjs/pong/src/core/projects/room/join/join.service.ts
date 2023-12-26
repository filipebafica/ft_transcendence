import { Logger } from '@nestjs/common';
import JoinRule from './rules/join.rule';
import RoomParticipantsGateway from '../shared/gateways/room.participants.gateway';
import { RequestDTO } from './dtos/request.dto';
import AuthenticateRule from './rules/authenticate.rule';
import GetHashedPasswordRule from './rules/get.hashed.password.rule';
import RoomGateway from '../shared/gateways/room.gateway';
import IsUserBannedRule from './rules/isUserBanned.rule';
import RoomBannedUserGateway from '../shared/gateways/room.user.banned.gateway';
import EventDispatchGateway from '../shared/gateways/event.dispatch.gateway';
import EventDispatchRule from './rules/event.dispatch.rule';

export class JoinService {
    private getHashedPassword: GetHashedPasswordRule;
    private authenticateRule: AuthenticateRule;
    private joinRule: JoinRule;
    private isUserBannedRule: IsUserBannedRule;
    private eventDispatchRule: EventDispatchRule; 

    constructor(
        private readonly logger:       Logger,
        roomGateway:                   RoomGateway,
        roomPartipantsGatway:          RoomParticipantsGateway,
        roomBannedUserGateway:         RoomBannedUserGateway,
        eventDispatchGateway:          EventDispatchGateway

    ) {
        this.getHashedPassword = new GetHashedPasswordRule(roomGateway);
        this.authenticateRule = new AuthenticateRule();
        this.joinRule = new JoinRule(roomPartipantsGatway);
        this.isUserBannedRule = new IsUserBannedRule(roomBannedUserGateway);
        this.eventDispatchRule = new EventDispatchRule(eventDispatchGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<void> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            await this.isUserBannedRule.apply(
                requestDTO.userId,
                requestDTO.roomId,
            )

            let hashedPassword = await this.getHashedPassword.apply(requestDTO.roomId);

            this.authenticateRule.apply(hashedPassword, requestDTO.password);

            await this.joinRule.apply(
                requestDTO.userId,
                requestDTO.roomId,
                requestDTO.isOwner,
                requestDTO.isAdamin
            );

            this.eventDispatchRule.apply(
                requestDTO.roomId,
                requestDTO.userId
            );

            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.userId} has joined room ${requestDTO.roomId}`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
