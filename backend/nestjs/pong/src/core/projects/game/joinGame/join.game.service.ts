import { Logger } from "@nestjs/common";
import { AlreadyPlayerException as AlreadyPlayingException } from "./exceptions/already.playing.exception";
import { AlreadyWaitingException } from "./exceptions/already.waiting.exception";
import { Response } from "./dtos/response.dto";
import { Request } from "./dtos/request.dto";
import GameState from "../shared/entities/game.state";
import { GameStateInterface } from "../shared/interfaces/game.state.interface";
import { QueueInterface } from "../shared/interfaces/queue.interface";

export class JoinGameService {

	constructor(
		private readonly logger: Logger,
		private waitingQueue: QueueInterface,
		private playingQueue: QueueInterface,
		private gameState: GameStateInterface,
	) {
	}

	public execute(request: Request): Response {
		try {
			this.logger.log(JSON.stringify(
				{
					"JoinGameService has started": {
						"request": request,
					}
				}
			));

			if (this.playingQueue.isOnQueue(request.playerConfig.uuid)) {
				throw new AlreadyPlayingException({key: "uuid", value: request.playerConfig.uuid});
			}

			if (this.waitingQueue.isOnQueue(request.playerConfig.uuid)) {
				throw new AlreadyWaitingException({key: "uuid", value: request.playerConfig.uuid});
			}

			let response: Response;
			if (this.waitingQueue.isEmpty()) {
				const gameState: GameState = this.gameState.createGame(request.playerConfig.uuid);
				this.waitingQueue.add(request.playerConfig.uuid, gameState.id);
				this.playingQueue.add(request.playerConfig.uuid, gameState.id)
				response = new Response(gameState);
			} else {
				const [playerId, gameId]: [string | number, string | number] = this.waitingQueue.first();
				this.waitingQueue.remove(playerId);
				const gameState: GameState = this.gameState.createSecondPlayer(request.playerConfig.uuid, gameId);
				this.playingQueue.add(playerId, gameId);
				response = new Response(gameState);
			}

			this.logger.log(JSON.stringify(
				{
					"JoinGameService has finished": {
						"response": response,
					}
				}
			));

			return response;
		} catch (error) {
			this.logger.error(JSON.stringify(
				{
					[error.message]: [error.additionalInfo],
				}
			));
			throw error;
		}
	}
} 
