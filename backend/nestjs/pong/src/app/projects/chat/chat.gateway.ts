import {
    MessageBody,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
  } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessageDTO } from './message.dto';

@WebSocketGateway({cors: {
    origin: '*',
}})
export class ChatGateway {
    @WebSocketServer()
    server: Server;

    @SubscribeMessage('messageRouter')
    handleEvent(
        @MessageBody() message: string,
        ): void {

            const messageDTO: MessageDTO = JSON.parse(message);
            this.server.emit(messageDTO.to, {
                from: messageDTO.from,
                to: messageDTO.to,
                message: messageDTO.message
            })
    }
}
