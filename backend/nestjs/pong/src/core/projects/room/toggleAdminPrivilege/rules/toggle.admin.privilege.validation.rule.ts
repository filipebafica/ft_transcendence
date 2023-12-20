import { request } from "http";
import RoomDTO from "../../shared/dtos/room.dto";

export class ToggleAdminPrivilegeValidationRule {
	public async apply(
		requesterId: number,
		targetId: number,
        toggle: boolean,
		roomDTO: RoomDTO,
	){
        let requester = roomDTO.participants.find((participant) => participant.user.id === requesterId);
        let target = roomDTO.participants.find((participant) => participant.user.id === targetId);

        if (!requester) {
            throw new Error(`User ${requesterId} is not a participant of room ${roomDTO.id}`)
        }

        if (!target) {
            throw new Error(`User ${targetId} is not a participant of room ${roomDTO.id}`)
        }

        if (!requester.isOwner && target.isOwner) {
            throw new Error(`User ${requesterId} has no privilege toggle admin privileges from user ${targetId}`)
        }

        if (!requester.isAdmin && !requester.isOwner) {
            throw new Error(`User ${requesterId} has no privilege toggle admin privileges from user ${targetId}`)
        }

        if (target.isAdmin == toggle) {
            throw new Error(`User ${requesterId} has its privilege already`)
        }
	}
}
