import RoomByUserIdDTO from "../../shared/dtos/room.by.user.id.dto";

export class ResponseDTO {
    constructor(
        public readonly rooms: RoomByUserIdDTO[]
    ) {
    }
}