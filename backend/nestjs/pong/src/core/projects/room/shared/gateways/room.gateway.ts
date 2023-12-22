import RoomByOneUserIdDTO from "../../listOneByUserId/dtos/room.by.one.user.id.dto";
import RoomByUserIdDTO from "../dtos/room.by.user.id.dto";
import RoomDTO from "../dtos/room.dto";

export default interface RoomGateway {
    get(): Promise<RoomDTO[]>;
    getByRomId(roomId: number): Promise<RoomDTO>;
    getAllByUserId(userId: number): Promise<RoomByUserIdDTO[]>;
    getOneByUserId(roomId: number, userId: number): Promise<RoomByOneUserIdDTO>;
    getHashedPassword(roomId: number): Promise<string>;
    changePassword(roomId: number, newPassword?: string): Promise<void>;
}