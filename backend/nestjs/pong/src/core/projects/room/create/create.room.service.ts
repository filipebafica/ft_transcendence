import { Logger } from '@nestjs/common';
import CreateRule from './rules/create.room.rule';
import CreateGateway from './gateways/room.gateway';
import { RequestDTO } from './dtos/request.dto';

export class CreateService {
    private createRule: CreateRule;

    constructor(
        private readonly logger: Logger,
        createGateway: CreateGateway
    ) {
        this.createRule = new CreateRule(createGateway);
    }

    execute(requestDTO: RequestDTO): void {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            this.createRule.apply(
                requestDTO.userId,
                requestDTO.roomName,
                requestDTO.type
            );

            this.logger.log(JSON.stringify({"Service has finished": "Room has been created"}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
