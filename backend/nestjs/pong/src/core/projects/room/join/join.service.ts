import { Logger } from '@nestjs/common';
import JoinRule from './rules/join.rule';
import JoinGateway from './gateways/join.gateways';
import { RequestDTO } from './dtos/request.dto';

export class JoinService {
    private joinRule: JoinRule;

    constructor(
        private readonly logger: Logger,
        joinGateway: JoinGateway
    ) {
        this.joinRule = new JoinRule(joinGateway);
    }

    execute(requestDTO: RequestDTO): void {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            this.joinRule.apply(requestDTO.userId, requestDTO.roomId);

            this.logger.log(JSON.stringify({"Service has finished": "User has joined the room"}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
