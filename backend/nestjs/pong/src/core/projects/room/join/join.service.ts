import { Logger } from '@nestjs/common';
import JoinRule from './rules/join.rule';
import RoomParticipantsGateway from '../shared/gateways/room.participants.gateways';
import { RequestDTO } from './dtos/request.dto';
import AuthenticateRule from './rules/authenticate.rule';
import GetHashedPasswordRule from './rules/get.hashed.password.rule';
import RoomGateway from '../shared/gateways/room.gateway';
import IsUserBannedRule from './rules/isUserBanned.rule';
import RoomBannedUserGateway from '../shared/gateways/room.user.banned.gateway';

export class JoinService {
    private getHashedPassword: GetHashedPasswordRule;
    private authenticateRule: AuthenticateRule;
    private joinRule: JoinRule;
    private isUserBannedRule: IsUserBannedRule;

    constructor(
        private readonly logger: Logger,
        roomGateway: RoomGateway,
        roomPartipantsGatway: RoomParticipantsGateway,
        roomBannedUserGateway: RoomBannedUserGateway,

    ) {
        this.getHashedPassword = new GetHashedPasswordRule(roomGateway);
        this.authenticateRule = new AuthenticateRule();
        this.joinRule = new JoinRule(roomPartipantsGatway);
        this.isUserBannedRule = new IsUserBannedRule(roomBannedUserGateway);
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
            this.logger.log(JSON.stringify({"Service has finished": `User ${requestDTO.userId} has joined room ${requestDTO.roomId}`}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
