import { Logger } from '@nestjs/common';
import CreateRule from './rules/join.rule';
import { RequestDTO } from './dtos/request.dto';
import FriendGateway from '../shared/gateways/friend.gateway';

export class CreateService {
    private createRule: CreateRule;

    constructor(
        private readonly logger: Logger,
        friendGateway: FriendGateway
    ) {
        this.createRule = new CreateRule(friendGateway);
    }

    async execute(requestDTO: RequestDTO) {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            await this.createRule.apply(
                requestDTO.userId,
                requestDTO.friendUserId,
                requestDTO.friendNickName
            );

            this.logger.log(JSON.stringify({"Service has finished": "friendship has been created"}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
