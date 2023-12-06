import { Logger } from '@nestjs/common';
import UserChatGateway from './gateways/user.chat.gateway';
import GetUserChatRule from './rules/get.user.chat.rule';
import Request from './dtos/request.dto';
import Response from './dtos/response.dto';
import IsAuthorizedRule from './rules/is.authorized.rule';

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

    execute(request: Request): Response {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": request}}));

            const userChat = this.getUserChatRule.apply(request.senderId);
            const isAuthorized = this.isAuthorizedRule.apply(request.receiverId, userChat.blockedUsers);
            const response = new Response(isAuthorized);

            this.logger.log(JSON.stringify({"Service has finished": {"response": response}}));
            return response;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
