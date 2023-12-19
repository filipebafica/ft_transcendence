import { GameStateInterface } from "../../shared/interfaces/game.state.interface";
import { Logger } from "@nestjs/common";
import GameState from "../../shared/entities/game.state";
import { Request } from "./dtos/request.dto";
import { MessageEmitterAdapter } from "src/app/projects/game/message.emitter.adapter";

export class CustomizeGameService {
	constructor(
		private readonly logger: Logger,
		private gameManager: GameStateInterface,
		private messageEmitter: MessageEmitterAdapter,
	) {
	}

	public async execute(request: Request): Promise<void> {
		try {
			this.logger.log(JSON.stringify(
				{
					"CustomizeGameService has started": {
						"request": request,
					}
				}
			));

			const gameState: GameState = await this.gameManager.updateGameWithCustomization(
				request.message.data.playerId,
				request.message.data.gameId,
				request.message.data.customization,
			);


			this.messageEmitter.emit(gameState.id.toString(), gameState);

			this.logger.log(JSON.stringify(
				{
					"CustomizeGameService has finished": {
						"response": gameState,
					}
				}
			));
		} catch (error) {
			this.logger.error(JSON.stringify(
				{
					"CustomizeGameService has finsihed with error": {
						"error": [error.message],
					}
				}
			))
			throw error;
		}
	}
}
