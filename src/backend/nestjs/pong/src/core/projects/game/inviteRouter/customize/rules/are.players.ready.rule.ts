import { PlayerStatus } from "../../../shared/enums/player.status";
import { QueueInterface } from "../../../shared/interfaces/queue.interface";

export class ArePlayersReadyRule {
	constructor(
		private waitingQueue: QueueInterface
	){}

	public async apply(
		gameId: number,
		playerOneId: number,
		playerTwoId: number
	): Promise<boolean> {
		const playerOneStatus: string = await this.waitingQueue.getPlayerStatus(
			gameId,
			playerOneId,
		);

		const playerTwoStatus: string = await this.waitingQueue.getPlayerStatus(
			gameId,
			playerTwoId,
		);

		if (playerOneStatus == PlayerStatus.Ready && playerTwoStatus == PlayerStatus.Ready) {
			return true;
		}

		return false
	}
}
