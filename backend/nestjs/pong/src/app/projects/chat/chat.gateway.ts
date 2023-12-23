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
    path: '/websocket/chat',
    cors: {
        origin: '*',
    }
})

export class ChatGateway {
    @WebSocketServer()
    server: Server;
    logger: Logger;

    constructor() {
        this.logger = new Logger(`chat::${ChatGateway.name}`)
    }

    @SubscribeMessage('messageRouter')
    handleEvent(
        @MessageBody() message: string,
        ): void {
            this.logger.log(JSON.stringify({"Gateway has started": {"received-message": message}}))

            const messageDTO: MessageDTO = JSON.parse(message);
            this.server.emit(messageDTO.from + '-direct-message', {
                from: messageDTO.from,
                to: messageDTO.to,
                message: messageDTO.message,
                timeStamp: messageDTO.timeStamp,
            })

            console.log('FROM1:', messageDTO.from + '-direct-message')
            this.server.emit(messageDTO.to + '-direct-message', {
                from: messageDTO.from,
                to: messageDTO.to,
                message: messageDTO.message,
                timeStamp: messageDTO.timeStamp,
            })
            console.log('TO:', messageDTO.to + '-direct-message')

            this.logger.log(JSON.stringify({"Gateway has finished": {"sent-message": MessageDTO}}))
    }
}
