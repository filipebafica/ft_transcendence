import { request } from "http";
import RoomDTO from "../../shared/dtos/room.dto";

export class ChangePasswordValidationRule {
    public async apply(
        requesterId: number,
        roomDTO: RoomDTO,
    ) {
        let requester = roomDTO.participants.find((participant) => participant.user.id === requesterId);

        if (!requester) {
            throw new Error(`User ${requesterId} is not a participant of room ${roomDTO.id}`)
        }

        if (!requester.isOwner) {
            throw new Error(`User ${requesterId} has no privilege to change room ${roomDTO.id} password`)
        }
	}
}
