import RoomDTO from "../../shared/dtos/room.dto";

export default class RemotionValidationRule {
    appy(
        removerUserId: number,
        removedUserId: number,
        roomDTO: RoomDTO
    ): void {
        let remover = roomDTO.participants.find((participant) => participant.user.id === removerUserId);
        let removed = roomDTO.participants.find((participant) => participant.user.id === removedUserId);

        if (!remover) {
            throw new Error(`User ${removerUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (!removed) {
            throw new Error(`User ${removedUserId} is not a participant of room ${roomDTO.id}`)
        }

        if (removerUserId === removedUserId) {
            return ;
        }

        if (!remover.isOwner && removed.isOwner) {
            throw new Error(`User ${removerUserId} has no privilege to remove user ${removedUserId}`)
        }

        if (!remover.isAdmin) {
            throw new Error(`User ${removerUserId} has no privilege to remove user ${removedUserId}`)
        }
    }
}