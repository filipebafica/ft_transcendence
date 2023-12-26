import { Logger } from '@nestjs/common';
import DeleteRule from './rules/join.rule';
import { RequestDTO } from './dtos/request.dto';
import FriendGateway from '../shared/gateways/friend.gateway';

export class DeleteService {
    private deleteRule: DeleteRule;

    constructor(
        private readonly logger: Logger,
        friendGateway: FriendGateway
    ) {
        this.deleteRule = new DeleteRule(friendGateway);
    }

    async execute(requestDTO: RequestDTO) {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            await this.deleteRule.apply(
                requestDTO.userId,
                requestDTO.friendUserId
            );

            this.logger.log(JSON.stringify({"Service has finished": "friendship has been deleted"}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
