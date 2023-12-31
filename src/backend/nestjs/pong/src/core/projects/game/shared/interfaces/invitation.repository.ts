import { InviteDTO } from "../../inviteRouter/invite/dtos/invite.dto"

export interface InvitationRepository {
	createInvite(
		senderId: number,
		senderSocketId: string,
		receiverId: number,
		status: string,
	): Promise<void>

	hasOpenInvite(
		senderId: number,
		receiverId: number,
	): Promise<boolean>

	updateInvite(
		senderId: number,
		receiverId: number,
		receiverSocketId: string,
		status: string,
		gameId?: number,
	): Promise<void | null>

	getOpenedInvite(
		senderId: number,
		receiverId: number,
	): Promise<InviteDTO>

	removeOpenedInviteById(
		playerId: number,
	): Promise<void>

	rejectOpenedInvites(
		playerId: number,
	): Promise<void>
}
