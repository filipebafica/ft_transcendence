import RoomDTO from "../../shared/dtos/room.dto";

export default class UnbanValidationRule {
    appy(
        bannerUserId: number,
        bannedUserId: number,
        roomDTO: RoomDTO
    ): void {
        let banner = roomDTO.participants.find((participant) => participant.user.id === bannerUserId);
        let banned = roomDTO.participants.find((participant) => participant.user.id === bannedUserId);

        if (!banner) {
            throw new Error(`User ${bannerUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (!banned) {
            throw new Error(`User ${bannedUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (!banner.isOwner && banned.isOwner) {
            throw new Error(`User ${bannerUserId} has no privilege to unban user ${bannedUserId}`)
        }

        if (!banner.isAdmin) {
            throw new Error(`User ${bannerUserId} has no privilege to unban user ${bannedUserId}`)
        }
    }
}