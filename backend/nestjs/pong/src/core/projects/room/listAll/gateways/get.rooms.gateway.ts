import RoomDTO from "../dtos/room.dto";

export default interface GetRoomsGateway {
    get(): RoomDTO[]
}