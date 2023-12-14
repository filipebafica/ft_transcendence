import { Logger } from "@nestjs/common";
import { AlreadyPlayerException as AlreadyPlayingException } from "./exceptions/already.playing.exception";
import { AlreadyWaitingException } from "./exceptions/already.waiting.exception";
import { Response } from "./dtos/response.dto";
import { Request } from "./dtos/request.dto";
import GameState from "../shared/entities/game.state";
import { GameStateInterface } from "../shared/interfaces/game.state.interface";
import { QueueInterface } from "../shared/interfaces/queue.interface";
import { ClientManagerInterface } from "../shared/interfaces/client.manager.interface";

export class JoinGameService {

	constructor(
		private readonly logger: Logger,
		private clientManager: ClientManagerInterface,
		private waitingQueue: QueueInterface,
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

			if (this.clientManager.getClientGameMask(request.playerConfig.clientid) !== undefined) {
				throw new AlreadyPlayingException({key: "uuid", value: request.playerConfig.uuid});
			}

			if (this.waitingQueue.isOnQueue(request.playerConfig.uuid)) {
				throw new AlreadyWaitingException({key: "uuid", value: request.playerConfig.uuid});
			}

			let response: Response;
			if (this.waitingQueue.isEmpty()) {
				/**
				 * @todo: criar adapter para buscar o nome do player a partir do ID
				 */
				const mockedPlayerName: string = "player1";
				const gameState: GameState = this.gameState.createGame(request.playerConfig.uuid, mockedPlayerName);
				this.waitingQueue.add(request.playerConfig.uuid, gameState.id);
				this.clientManager.addClientGameMask(request.playerConfig.clientid, gameState.id);
				response = new Response(gameState);
			} else {
				const [playerId, gameId]: [string | number, string | number] = this.waitingQueue.first();
				this.waitingQueue.remove(playerId);
				/**
				 * @todo: criar adapter para buscar o nome do player a partir do ID
				 */
				const mockedPlayerName: string = "player2";
				const gameState: GameState = this.gameState.createSecondPlayer(request.playerConfig.uuid, gameId, mockedPlayerName);
				this.clientManager.addClientGameMask(request.playerConfig.clientid, gameState.id);
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
