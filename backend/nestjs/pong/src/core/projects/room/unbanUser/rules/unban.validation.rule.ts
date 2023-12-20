import RoomDTO from "../../shared/dtos/room.dto";

export default class UnbanValidationRule {
    appy(
        unbannerUserId: number,
        unbannedUserId: number,
        roomDTO: RoomDTO
    ): void {
        let unbanner = roomDTO.participants.find((participant) => participant.user.id === unbannerUserId);
        let unbanned = roomDTO.participants.find((participant) => participant.user.id === unbannedUserId);

        if (!unbanner) {
            throw new Error(`User ${unbannerUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (!unbanned) {
            throw new Error(`User ${unbannedUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (!unbanner.isOwner && unbanned.isOwner) {
            throw new Error(`User ${unbannerUserId} has no privilege to unban user ${unbannedUserId}`)
        }

        if (!unbanner.isAdmin) {
            throw new Error(`User ${unbannerUserId} has no privilege to unban user ${unbannedUserId}`)
        }
    }
}