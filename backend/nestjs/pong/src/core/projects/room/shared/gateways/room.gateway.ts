import RoomDTO from "../dtos/room.dto";

export default interface RoomGateway {
    get(): Promise<RoomDTO[]>;

    getByUserId(userId: number): Promise<RoomDTO[]>;
}