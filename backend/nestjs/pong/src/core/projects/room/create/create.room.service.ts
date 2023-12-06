import { Logger } from '@nestjs/common';
import CreateRoomRule from './rules/create.room.rule';
import RoomGateway from './gateways/room.gateway';
import Request from './dtos/request.dto';

export class CreateRoomService {
    private createRoomRule: CreateRoomRule;

    constructor(
        private readonly logger: Logger,
        roomGateway: RoomGateway
    ) {
        this.createRoomRule = new CreateRoomRule(roomGateway);
    }

    execute(request: Request): void {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": request}}));

            this.createRoomRule.apply(
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
