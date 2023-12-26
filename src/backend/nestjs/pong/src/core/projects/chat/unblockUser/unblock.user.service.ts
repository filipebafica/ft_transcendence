import { Logger } from '@nestjs/common';
import UserChatGateway from '../shared/user.chat.gateway';
import { UnblockUserRule } from './rules/unblock.user.rule';
import { RequestDTO } from './dtos/request.dto';

export class UnblockUserService {
    private unblockUserRule: UnblockUserRule;

    constructor(
        private readonly logger: Logger,
        userChatGateway: UserChatGateway
    ) {
        this.unblockUserRule = new UnblockUserRule(userChatGateway);
    }

    async execute(requestDTO: RequestDTO) {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            await this.unblockUserRule.apply(requestDTO.unBlockerUserId, requestDTO.targetUserId);

            this.logger.log(JSON.stringify({"Service has finished": "user has been unblocked"}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
