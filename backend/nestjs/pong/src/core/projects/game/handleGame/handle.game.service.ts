import { Logger } from "@nestjs/common";
import { GameStateInterface } from "../shared/interfaces/game.state.interface";

export class HandleGameService {

	constructor(
		private gameState: GameStateInterface,
	) {
	}

	public async gameLoop(): Promise<void> {
		const updatePromises = this.gameState.collectUpdatePromises();
		await this.gameState.waitAllUpdatesToComplete(updatePromises);
		await this.gameState.delay();
	}
}
