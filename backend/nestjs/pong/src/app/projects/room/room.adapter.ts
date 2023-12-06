import { Injectable } from "@nestjs/common";
import RoomGateway from "src/core/projects/room/create/gateways/room.gateway";


// Room tabele has id, participants, owner, admin
@Injectable()
export default class RoomAdapter implements RoomGateway {
    create(
        userId: number,
        roomName: string,
        type: string
    ): void {
    }
}