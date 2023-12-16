import { Logger } from '@nestjs/common';
import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ListByUserIdService } from 'src/core/projects/friend/listByUserId/list.by.user.id.service';
import FriendAdapter from './friend.adapter';
import { EntityManager } from 'typeorm';
import { MessageDTO } from './message.dto';
import { RequestDTO } from 'src/core/projects/friend/listByUserId/dtos/request.dto';
import FriendDTO from 'src/core/projects/friend/listByUserId/dtos/friend.dto';

@WebSocketGateway({
    path: '/websocket/status',
    cors: {
        origin: '*',
    }
})

export class StatusGateway {
    @WebSocketServer()
    server: Server;
    logger: Logger;
    friendService: ListByUserIdService;

    constructor(
        entityManager: EntityManager
    ) {
        this.logger = new Logger(StatusGateway.name);

        this.friendService = new ListByUserIdService(
            new Logger(ListByUserIdService.name),
            new FriendAdapter(entityManager)
        )
    }

    @SubscribeMessage('statusRouter')
    async handleEvent(
        @MessageBody() message: string) {
            this.logger.log(JSON.stringify({"Gateway has started": {"received-message": message}}))

            const messageDTO: MessageDTO = JSON.parse(message);
            const responseDTO = await this.friendService.execute(
                new RequestDTO(messageDTO.userId)
            );

            responseDTO.friends.map(
                (friendDTO: FriendDTO) => {
                    this.server.emit(
                        friendDTO.id + '-friend-status-change', messageDTO
                    )

                    this.logger.log(JSON.stringify({"Gateway has finished": {
                        "sent-message-to": friendDTO.id + '-friend-status-change',
                        "message":  messageDTO.status
                    }}));
                }
            );
    }
}
