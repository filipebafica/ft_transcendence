import GameState from "../../../shared/entities/game.state";
import { GameStateInterface } from "../../../shared/interfaces/game.state.interface";
import { QueueInterface } from "../../../shared/interfaces/queue.interface";

export class StartGameRule {
	constructor(
		private waitingQueue: QueueInterface,
		private gameManager: GameStateInterface,
	){}

	public async apply(
		gameId: number,
		playerOneId: number,
		playerTwoId: number,
	): Promise<GameState> {
		await this.waitingQueue.remove(playerOneId);
		await this.waitingQueue.remove(playerTwoId);

		const gameState: GameState = await this.gameManager.updateGameToRunning(
			gameId,
		);

		return gameState;
	}
}
