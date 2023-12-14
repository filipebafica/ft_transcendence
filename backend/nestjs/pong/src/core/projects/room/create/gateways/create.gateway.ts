import RoomDTO from "../../shared/dtos/room.dto";

export default interface CreateGateway {
    create(
        roomName: string,
        isPublic: boolean
    ): Promise<RoomDTO>;
}