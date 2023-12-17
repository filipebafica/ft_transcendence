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
import { RequestDTO as ListByUserIdRequestDTO } from 'src/core/projects/friend/listByUserId/dtos/request.dto';
import FriendDTO from 'src/core/projects/friend/listByUserId/dtos/friend.dto';
import { CreateStatusService } from 'src/core/projects/status/create/create.status.service';
import StatusAdapter from './status.adapter';
import { RequestDTO as CreateStatusRequestDTO } from 'src/core/projects/status/create/dtos/request.dto';

@WebSocketGateway({
    namespace: '/websocket/status',
    cors: {
        origin: '*',
    }
})

export class StatusGateway {
    @WebSocketServer()
    server: Server;
    logger: Logger;
    friendService: ListByUserIdService;
    createStatusService: CreateStatusService;

    constructor(
        entityManager: EntityManager
    ) {
        this.logger = new Logger(StatusGateway.name);

        this.friendService = new ListByUserIdService(
            new Logger(ListByUserIdService.name),
            new FriendAdapter(entityManager)
        );

        this.createStatusService = new CreateStatusService(
            new Logger(CreateStatusService.name),
            new StatusAdapter(entityManager)
        );
    }

    @SubscribeMessage('statusRouter')
    async handleEvent(
        @MessageBody() message: string
    ) {
        this.logger.log(JSON.stringify({"Gateway has started": {"received-message": message}}))

        const messageDTO: MessageDTO = JSON.parse(message);
        const responseDTO = await this.friendService.execute(
            new ListByUserIdRequestDTO(messageDTO.userId)
        );

        responseDTO.friends.map(
            (friendDTO: FriendDTO) => {
                this.server.emit(
                    friendDTO.id + '-friend-status-change', messageDTO
                );

                this.createStatusService.execute(
                    new CreateStatusRequestDTO(
                        messageDTO.userId,
                        messageDTO.status
                    )
                );

                this.logger.log(JSON.stringify({"Gateway has finished": {
                    "sent-message-to": friendDTO.id + '-friend-status-change',
                    "message":  messageDTO.status
                }}));
            }
        );
    }
}
