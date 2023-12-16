import { Logger } from '@nestjs/common';
import { ResponseDTO } from './dtos/response.dto';
import GetFriendsRule from './rules/get.friends.rule';
import { RequestDTO } from './dtos/request.dto';
import FriendGateway from '../shared/gateways/friend.gateway';

export class ListByUserIdService {
    private getFriendsRule: GetFriendsRule;

    constructor(
        private readonly logger: Logger,
        friendGateway: FriendGateway
    ) {
        this.getFriendsRule = new GetFriendsRule(friendGateway);
    }

   async execute(requestDTO: RequestDTO): Promise<ResponseDTO>
    {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const rooms = await this.getFriendsRule.apply(requestDTO.userId);
            const responseDTO = new ResponseDTO(rooms);

            this.logger.log(JSON.stringify({"Service has finished": {"response": responseDTO}}));
            return responseDTO;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
