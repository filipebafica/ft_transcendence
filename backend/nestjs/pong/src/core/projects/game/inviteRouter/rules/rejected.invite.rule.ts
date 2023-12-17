import { InviteStatus } from "../../shared/enums/invite.status";
import { InvitationRepository } from "../../shared/interfaces/invitation.repository";
import { Request } from "../dtos/request.dto";

export class RejectedInviteRule {
	constructor(
		private invitationRegister: InvitationRepository,
	){}

	public async apply(request: Request, inviteStatus: InviteStatus) {
		await this.invitationRegister.updateInvite(
			request.message.data.to,
			request.message.data.from,
			request.socketId,
			inviteStatus,
		)
	}
}
