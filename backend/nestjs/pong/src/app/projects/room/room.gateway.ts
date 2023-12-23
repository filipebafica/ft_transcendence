import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageDTO } from './message.dto';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
    path:'/websocket/room',
    cors: {
        origin: '*',
    }
})

export class RoomGateway {
    @WebSocketServer()
    server: Server;
    logger: Logger;

    constructor() {
        this.logger = new Logger(`room::${RoomGateway.name}`)
    }

    @SubscribeMessage('messageRouter')
    handleEvent(
        @MessageBody() message: string,
    ): void {
        this.logger.log(JSON.stringify({"Gateway has started": {"received-message": message}}))

        const messageDTO: MessageDTO = JSON.parse(message);
        this.server.emit(messageDTO.room + '-room-message', {
            from: messageDTO.from,
            message: messageDTO.message,
            timeStamp: messageDTO.timeStamp
        })

        this.logger.log(JSON.stringify({"Gateway has finished": {"sent-message": MessageDTO}}))
    }
}
