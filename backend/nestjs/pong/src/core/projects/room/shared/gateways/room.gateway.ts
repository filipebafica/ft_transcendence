import RoomByParticipantDTO from "../../listByUserId/dtos/room.by.participant.dto";
import RoomDTO from "../dtos/room.dto";

export default interface RoomGateway {
    get(): Promise<RoomDTO[]>;
    getByRomId(roomId: number): Promise<RoomDTO>;
    getByUserId(userId: number): Promise<RoomByParticipantDTO[]>;
}