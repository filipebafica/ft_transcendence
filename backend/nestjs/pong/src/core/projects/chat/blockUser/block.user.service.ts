import { Logger } from '@nestjs/common';
import UserChatGateway from '../shared/user.chat.gateway';
import { BlockUserRule } from './rules/block.user.rule';
import { RequestDTO } from './dtos/request.dto';

export class BlockUserService {
    private blockUserRule: BlockUserRule;

    constructor(
        private readonly logger: Logger,
        userChatGateway: UserChatGateway
    ) {
        this.blockUserRule = new BlockUserRule(userChatGateway);
    }

    async execute(requestDTO: RequestDTO) {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            await this.blockUserRule.apply(requestDTO.blockerUserId, requestDTO.targetUserId);

            this.logger.log(JSON.stringify({"Service has finished": "user has been blocked"}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
