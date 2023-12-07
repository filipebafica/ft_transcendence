import { Injectable } from "@nestjs/common";
import CreateGateway from "src/core/projects/room/create/gateways/room.gateway";
import RoomDTO from "src/core/projects/room/dependencies/dtos/room.dto";
import GetRoomsGateway from "src/core/projects/room/dependencies/gateways/get.rooms.gateway";


// Room tabele has id, name, ownerId, adminId, type, participants,
@Injectable()
export default class RoomAdapter implements CreateGateway, GetRoomsGateway {
    create(
        userId: number,
        roomName: string,
        type: string
    ): void {
    }

    get(): RoomDTO[] {
        return [
            new RoomDTO(1, 'room1', 1, 1, 'public', [1, 2, 3]),
            new RoomDTO(2, 'room2', 2, 2, 'public', [1, 2, 3]),
            new RoomDTO(3, 'room3', 3, 3, 'public', [1, 2, 3]),
        ];
    }

    getByUserId(userId: number): RoomDTO[] {
        console.log(typeof userId)

        return [
            new RoomDTO(1, 'room1', 1, 1, 'private', [1, 2, 3]),
            new RoomDTO(2, 'room2', 2, 2, 'public', [1, 2, 3]),
            new RoomDTO(3, 'room3', 3, 3, 'public', [1, 2, 3]),
        ];
    }
}