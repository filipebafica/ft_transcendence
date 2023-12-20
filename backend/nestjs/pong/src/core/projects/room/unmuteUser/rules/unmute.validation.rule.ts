import RoomDTO from "../../shared/dtos/room.dto";

export default class UnmuteValidationRule {
    appy(
        unmuterUserId: number,
        unmutedUserId: number,
        roomDTO: RoomDTO
    ): void {
        let unmuter = roomDTO.participants.find((participant) => participant.user.id === unmuterUserId);
        let unmuted = roomDTO.participants.find((participant) => participant.user.id === unmutedUserId);

        if (!unmuter) {
            throw new Error(`User ${unmuterUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (!unmuted) {
            throw new Error(`User ${unmutedUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (!unmuter.isOwner && unmuted.isOwner) {
            throw new Error(`User ${unmuterUserId} has no privilege to unmute user ${unmutedUserId}`)
        }

        if (!unmuter.isAdmin) {
            throw new Error(`User ${unmuterUserId} has no privilege to unmute user ${unmutedUserId}`)
        }
    }
}