import RoomDTO from "../../shared/dtos/room.dto";

export default class MuteValidationRule {
    appy(
        muterUserId: number,
        mutedUserId: number,
        roomDTO: RoomDTO
    ): void {
        let muter = roomDTO.participants.find((participant) => participant.user.id === muterUserId);
        let muted = roomDTO.participants.find((participant) => participant.user.id === mutedUserId);

        if (!muter) {
            throw new Error(`User ${muterUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (!muted) {
            throw new Error(`User ${mutedUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (!muter.isOwner && muted.isOwner) {
            throw new Error(`User ${muterUserId} has no privilege to mute user ${mutedUserId}`)
        }

        if (!muter.isAdmin) {
            throw new Error(`User ${muterUserId} has no privilege to mute user ${mutedUserId}`)
        }
    }
}