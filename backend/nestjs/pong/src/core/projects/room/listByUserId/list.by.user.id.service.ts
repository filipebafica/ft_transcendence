import { Logger } from '@nestjs/common';
import ResponseDTO from './dtos/response.dto';
import GetRoomsRule from './rules/get.rooms.rule';
import { RequestDTO } from './dtos/request.dto';
import GetRoomsGateway from '../shared/gateways/get.rooms.gateway';

export class ListByUserIdService {
    private getRoomsRule: GetRoomsRule;

    constructor(
        private readonly logger: Logger,
        getRoomsGateway: GetRoomsGateway
    ) {
        this.getRoomsRule = new GetRoomsRule(getRoomsGateway);
    }

    execute(requestDTO: RequestDTO): ResponseDTO
    {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const rooms = this.getRoomsRule.apply(requestDTO.userId);
            const responseDTO = new ResponseDTO(rooms);

            this.logger.log(JSON.stringify({"Service has finished": {"response": responseDTO}}));
            return responseDTO;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
