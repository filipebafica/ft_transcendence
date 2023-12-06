import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageDTO } from './message.dto';

@WebSocketGateway({
    path:'/room',
    cors: {
        origin: '*',
    }
})

export class RoomGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('messageRouter')
    handleEvent(
        @MessageBody() message: string,
        ): void {
            const messageDTO: MessageDTO = JSON.parse(message);
            this.server.emit(messageDTO.room, {
                from: messageDTO.from,
                message: messageDTO.message,
                timeStamp: messageDTO.timeStamp
            })
    }
}
