import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageDTO } from './message.dto';

@WebSocketGateway({
    path: '/websocket/chat',
    cors: {
        origin: '*',
    }
})

export class ChatGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('messageRouter')
    handleEvent(
        @MessageBody() message: string,
        ): void {
            const messageDTO: MessageDTO = JSON.parse(message);

            this.server.emit(messageDTO.from + '-direct-message', {
                from: messageDTO.from,
                to: messageDTO.to,
                message: messageDTO.message,
                timeStamp: messageDTO.timeStamp,
            })

            this.server.emit(messageDTO.to + '-direct-message', {
                from: messageDTO.from,
                to: messageDTO.to,
                message: messageDTO.message,
                timeStamp: messageDTO.timeStamp,
            })
    }
}
