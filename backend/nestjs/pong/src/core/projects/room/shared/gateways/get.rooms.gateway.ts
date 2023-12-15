import RoomDTO from "../dtos/room.dto";

export default interface GetRoomsGateway {
    get(): Promise<RoomDTO[]>;

    getByUserId(userId: number): Promise<RoomDTO[]>;
}