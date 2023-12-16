import { Logger } from '@nestjs/common';
import { ResponseDTO } from './dtos/response.dto';
import RoomGateway from '../shared/gateways/room.gateway';
import GetRoomsRule from './rules/get.rooms.rule';

export class ListAllService {
    private getRoomsRule: GetRoomsRule;

    constructor(
        private readonly logger: Logger,
        roomGateway: RoomGateway
    ) {
        this.getRoomsRule = new GetRoomsRule(roomGateway);
    }

    async execute(): Promise<ResponseDTO>
    {
        try {
            this.logger.log("{Service has started}");

            const rooms = await this.getRoomsRule.apply();
            const responseDTO = new ResponseDTO(rooms);

            this.logger.log(JSON.stringify({"Service has finished": {"response": responseDTO}}));
            return responseDTO;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
