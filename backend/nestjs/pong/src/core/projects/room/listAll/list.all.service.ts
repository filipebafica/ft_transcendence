import { Logger } from '@nestjs/common';
import ResponseDTO from './dtos/response.dto';
import GetRoomsGateway from '../shared/gateways/get.rooms.gateway';
import GetRoomsRule from './rules/get.rooms.rule';

export class ListAllService {
    private getRoomsRule: GetRoomsRule;

    constructor(
        private readonly logger: Logger,
        getRoomsGateway: GetRoomsGateway
    ) {
        this.getRoomsRule = new GetRoomsRule(getRoomsGateway);
    }

    execute(): ResponseDTO
    {
        try {
            this.logger.log("{Service has started}");

            const rooms = this.getRoomsRule.apply();
            const responseDTO = new ResponseDTO(rooms);

            this.logger.log(JSON.stringify({"Service has finished": {"response": responseDTO}}));
            return responseDTO;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
