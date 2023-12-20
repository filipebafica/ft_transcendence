import GameState from "../../../shared/entities/game.state";
import { PlayerCustomization } from "../../../shared/entities/player.customization";
import { GameStateInterface } from "../../../shared/interfaces/game.state.interface";
import { QueueInterface } from "../../../shared/interfaces/queue.interface";

export class CustomizePlayerRule {
	constructor(
		private gameManager: GameStateInterface,
		private waitingQueue: QueueInterface,
	){}

	public async apply(
		playerId: number,
		gameId: number,
		customization: PlayerCustomization,
	): Promise<GameState> {
		const gameState: GameState = await this.gameManager.updateGameWithCustomization(
			playerId,
			gameId,
			customization,
		);

		await this.waitingQueue.updateToReady(
			playerId,
		);

		return gameState;
	}
}
