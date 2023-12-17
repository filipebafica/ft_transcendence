import { MessageEmitterAdapter } from "src/app/projects/game/message.emitter.adapter";
import { InviteStatus } from "../../shared/enums/invite.status";
import { InvitationRepository } from "../../shared/interfaces/invitation.repository";
import { Request } from "../dtos/request.dto";

export class OpenInviteRule {
	constructor(
		private invitationRegister: InvitationRepository,
		private messageEmitter: MessageEmitterAdapter,
	){}

	public async apply(request: Request, inviteStatus: InviteStatus) {
		await this.invitationRegister.createInvite(
			request.message.data.from,
			request.socketId,
			request.message.data.to,
			inviteStatus,
		);

		this.messageEmitter.emit(
			`${request.message.data.to.toString()}-invite`,
			request.message,
		);
	}
}
