import { Logger } from '@nestjs/common';
import UserChatGateway from './gateways/user.chat.gateway';
import GetUserChatRule from './rules/get.user.chat.rule';
import RequestDTO from './dtos/request.dto';
import IsAuthorizedRule from './rules/is.authorized.rule';
import ResponseDTO from './dtos/response.dto';

export class SendMessageAuthorizationService {
    private getUserChatRule: GetUserChatRule;
    private isAuthorizedRule: IsAuthorizedRule;

    constructor(
        private readonly logger: Logger,
        userChatGatway: UserChatGateway
    ) {
        this.getUserChatRule = new GetUserChatRule(userChatGatway);
        this.isAuthorizedRule = new IsAuthorizedRule();
    }

    execute(request: RequestDTO): ResponseDTO {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": request}}));

            const userChat = this.getUserChatRule.apply(request.senderId);
            const isAuthorized = this.isAuthorizedRule.apply(request.receiverId, userChat.blockedUsers);
            const responseDTO = new ResponseDTO(isAuthorized);

            this.logger.log(JSON.stringify({"Service has finished": {"response": responseDTO}}));
            return responseDTO;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
