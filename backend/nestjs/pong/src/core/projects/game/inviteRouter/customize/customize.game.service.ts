import { GameStateInterface } from "../../shared/interfaces/game.state.interface";
import { Logger } from "@nestjs/common";
import GameState from "../../shared/entities/game.state";
import { Request } from "./dtos/request.dto";
import { MessageEmitterAdapter } from "src/app/projects/game/message.emitter.adapter";
import { QueueInterface } from "../../shared/interfaces/queue.interface";
import { CustomizePlayerRule } from "./rules/customize.player.rule";
import { ArePlayersReadyRule } from "./rules/are.players.ready.rule";
import { StartGameRule } from "./rules/start.game.rule";

export class CustomizeGameService {
	private customizePlayerRule: CustomizePlayerRule;
	private arePlayersReadyRule: ArePlayersReadyRule;
	private startGameRule: StartGameRule;

	constructor(
		private readonly logger: Logger,
		private gameManager: GameStateInterface,
		private messageEmitter: MessageEmitterAdapter,
		private waitingQueue: QueueInterface,
	) {
		this.customizePlayerRule = new CustomizePlayerRule(
			this.gameManager,
			this.waitingQueue,
		);

		this.arePlayersReadyRule = new ArePlayersReadyRule(
			this.waitingQueue,
		);

		this.startGameRule = new StartGameRule(
			this.waitingQueue,
			this.gameManager,
		);
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

			let gameState: GameState = await this.customizePlayerRule.apply(
				request.message.data.playerId,
				request.message.data.gameId,
				request.message.data.customization,
			);

			const areReady: boolean = await this.arePlayersReadyRule.apply(
				gameState.id,
				gameState.player1.id,
				gameState.player2.id,
			);

			if (areReady) {
				gameState = await this.startGameRule.apply(
					gameState.id,
					gameState.player1.id,
					gameState.player2.id,
				);
			}

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
