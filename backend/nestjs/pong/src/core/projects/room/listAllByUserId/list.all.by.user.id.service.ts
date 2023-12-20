import { Logger } from '@nestjs/common';
import { ResponseDTO } from './dtos/response.dto';
import GetRoomsRule from './rules/get.rooms.rule';
import { RequestDTO } from './dtos/request.dto';
import RoomGateway from '../shared/gateways/room.gateway';

export class ListAllByUserIdService {
    private getRoomsRule: GetRoomsRule;

    constructor(
        private readonly logger: Logger,
        roomGateway: RoomGateway
    ) {
        this.getRoomsRule = new GetRoomsRule(roomGateway);
    }

   async execute(requestDTO: RequestDTO): Promise<ResponseDTO>
    {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const rooms = await this.getRoomsRule.apply(requestDTO.userId);
            const responseDTO = new ResponseDTO(rooms);

            this.logger.log(JSON.stringify({"Service has finished": {"response": responseDTO}}));
            return responseDTO;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
