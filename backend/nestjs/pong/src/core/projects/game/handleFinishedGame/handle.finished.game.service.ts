import { Logger } from "@nestjs/common";
import { GameStateInterface } from "../shared/interfaces/game.state.interface";
import { ClientManagerInterface } from "../shared/interfaces/client.manager.interface";
import GameState from "../shared/entities/game.state";
import { Response } from "./dtos/response.dto";

export class HandleFinishedGameService {
	constructor(
		private readonly logger: Logger,
		private gameStateManager: GameStateInterface,
		private clientManager: ClientManagerInterface,
	) {
	}

	public async finishGameLoop(): Promise<Response> {
		const finishedGames: GameState[] = [];

		for (const gameState of this.gameStateManager.getFinishedGames()) {

			await this.finishGameRoutine(gameState);
			finishedGames.push(gameState);
			/**
			 * Preciso fazer com que a função dentro dessa promise atualize a tabela de score
			 * remova os games do clientManager e retorne o gameState associado para o client
			 * para que assim ele possa fazer uma request para o back no endpoint de score.
			 */
		}

		const response: Response = new Response(finishedGames);
		return response;
	}

	private async finishGameRoutine(gameState: GameState): Promise<GameState> {
		//adapter para atualizar a tabela
		this.clientManager.removeGameMask(gameState.id);
		this.gameStateManager.deleteFinishedGame(gameState);
		return gameState;
	}
}
