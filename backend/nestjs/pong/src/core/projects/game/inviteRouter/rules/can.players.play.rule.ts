import { ClientManagerInterface } from "../../shared/interfaces/client.manager.interface";
import { GameHistoryRepository } from "../../shared/interfaces/game.history.repository";
import { InvitationRepository } from "../../shared/interfaces/invitation.repository";
import { QueueInterface } from "../../shared/interfaces/queue.interface";
import { Request } from "../dtos/request.dto";

export class CanPlayersPlayRule {
	constructor(
		private gameHistory: GameHistoryRepository,
		private WaitingQueue: QueueInterface,
		private invitationRepository: InvitationRepository,
	) {}

	public async apply(request: Request): Promise<boolean> {
		if (await this.gameHistory.getRunningGameByPlayerId(request.message.data.to) != null) {
			return false;
		}

		if (await this.gameHistory.getRunningGameByPlayerId(request.message.data.from) != null) {
			return false;
		}

		if (await this.WaitingQueue.isOnQueue(request.message.data.to) != false) {
			return false;
		}

		if (await this.WaitingQueue.isOnQueue(request.message.data.from) != false) {
			return false;
		}

		if (await this.invitationRepository.hasOpenInvite(request.message.data.to, request.message.data.from) != false) {
			return false;
		}

		return true;
	}
}
