import RoomPartitipantsDTO from "../../join/dtos/room.participants.dto";

export default interface RoomParticipantsGateway {
    join(
        userId: number,
        roomId: number,
        isOwner: boolean,
        isAdamin: boolean
    ): Promise<RoomPartitipantsDTO>;
}