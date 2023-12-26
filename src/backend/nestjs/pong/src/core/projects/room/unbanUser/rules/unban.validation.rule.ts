import RoomDTO from "../../shared/dtos/room.dto";

export default class UnbanValidationRule {
    appy(
        unbannerUserId: number,
        unbannedUserId: number,
        roomDTO: RoomDTO
    ): void {
        let unbanner = roomDTO.participants.find((participant) => participant.user.id === unbannerUserId);
        if (!unbanner) {
            throw new Error(`User ${unbannerUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (!unbanner.isOwner && !unbanner.isAdmin) {
            throw new Error(`User ${unbannerUserId} has no privilege to unban user ${unbannedUserId}`)
        }
    }
}
