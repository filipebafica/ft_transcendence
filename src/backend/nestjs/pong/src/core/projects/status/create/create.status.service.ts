import { Logger } from '@nestjs/common';
import CreateRule from './rules/create.rule';
import { RequestDTO } from './dtos/request.dto';
import StatusGateway from '../shared/gateways/status.gateway';

export class CreateStatusService {
    private createRule: CreateRule;

    constructor(
        private readonly logger: Logger,
        statusGateway: StatusGateway
    ) {
        this.createRule = new CreateRule(statusGateway);
    }

    async execute(requestDTO: RequestDTO) {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            await this.createRule.apply(
                requestDTO.userId,
                requestDTO.newStatus
            );

            this.logger.log(JSON.stringify({"Service has finished": "status has been created"}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            // throw error;
        }
    }
}
