import { Logger } from '@nestjs/common';
import { ResponseDTO } from './dtos/response.dto';
import GetRoomRule from './rules/get.room.rule';
import { RequestDTO } from './dtos/request.dto';
import RoomGateway from '../shared/gateways/room.gateway';

export class ListOneByUserIdService {
    private getRoomsRule: GetRoomRule;

    constructor(
        private readonly logger: Logger,
        roomGateway: RoomGateway
    ) {
        this.getRoomsRule = new GetRoomRule(roomGateway);
    }

   async execute(requestDTO: RequestDTO): Promise<ResponseDTO>
    {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const room = await this.getRoomsRule.apply(requestDTO.roomId, requestDTO.userId);
            const responseDTO = new ResponseDTO(room);

            this.logger.log(JSON.stringify({"Service has finished": {"response": responseDTO}}));
            return responseDTO;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
