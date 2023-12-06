import { Logger } from '@nestjs/common';
import CreateRule from './rules/create.room.rule';
import CreateGateway from './gateways/room.gateway';
import Request from './dtos/request.dto';

export class CreateService {
    private createRule: CreateRule;

    constructor(
        private readonly logger: Logger,
        createGateway: CreateGateway
    ) {
        this.createRule = new CreateRule(createGateway);
    }

    execute(request: Request): void {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": request}}));

            this.createRule.apply(
                request.userId,
                request.roomName,
                request.type
            );

            this.logger.log(JSON.stringify({"Service has finished": "Room has been created"}));
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
