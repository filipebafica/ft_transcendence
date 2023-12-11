import { Logger } from "@nestjs/common";
import { GameStateInterface } from "../shared/interfaces/game.state.interface";
import { ClientManagerInterface } from "../shared/interfaces/client.manager.interface";
import { Request } from "./dtos/request.dto";
import GameState from "../shared/entities/game.state";
import { Response } from "./dtos/response.dto";
import { UnavailableGameIdException } from "./exceptions/unavailable.gameid.exception";
import { ClientIsNotPlayingException } from "./exceptions/unavailable.gamemask.exception";

export class HandleDisconnectService {
	constructor(
		private readonly logger: Logger,
		private clientManager: ClientManagerInterface,
		private gameState: GameStateInterface,
	){
	}

	public execute(request: Request): Response {
		try {
			this.logger.log(JSON.stringify(
				{
					"HandleDisconnectService has started": {
						"request": request,
					}
				}
			));

			const gameId: string | undefined = this.clientManager.getClientGameMask(request.clientId);
			if (gameId == undefined) {
				throw new ClientIsNotPlayingException({key: "gameId", value: request.clientId});
			}

			const gameState: GameState = this.gameState.closeGame(gameId);
			if (gameState == undefined) {
				throw new UnavailableGameIdException({key: "gameId", value: gameId});
			}
			this.clientManager.removeGameMask(gameState.id, request.clientId);
			/**
			 * @todo: implementar interface para salvar score na tabela;
			*/

			const response: Response = new Response(gameState);

			this.logger.log(JSON.stringify(
				{
					"HandleDisconnectService has finished": {
						"request": response,
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
