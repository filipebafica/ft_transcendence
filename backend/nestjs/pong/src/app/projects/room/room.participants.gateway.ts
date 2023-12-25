import { Logger } from "@nestjs/common";
import { 
    WebSocketGateway,
    WebSocketServer 
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { RoomParticipantsMessageDTO } from "./room.participants.message.dto";
import { OnEvent } from "@nestjs/event-emitter";

@WebSocketGateway({
    path:'/websocket/room/participants',
    cors: {
        origin: '*',
    }
})
export class RoomParticipantsGateway {
    @WebSocketServer()
    server: Server;
    logger: Logger;

    constructor() {
        this.logger = new Logger(`room::${RoomParticipantsGateway.name}`);
    }

    @OnEvent('room.participants.actionRouter')
    handleEvent(
        message: string,
    ): void {
        this.logger.log(JSON.stringify({"Gateway has started": {"received-message": message}}))

        const messageDTO: RoomParticipantsMessageDTO = JSON.parse(message);
        this.server.emit(messageDTO.room + '-room-participants-action-message', {
            room: messageDTO.room,
            user: messageDTO.user,
            action: messageDTO.action,
            timeStamp: messageDTO.timeStamp
        })

        this.logger.log(JSON.stringify({"Gateway has finished": {"sent-message": messageDTO}}))
    }

}