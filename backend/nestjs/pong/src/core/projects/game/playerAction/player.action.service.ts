import { Logger } from "@nestjs/common";
import { GameStateInterface } from "../shared/interfaces/game.state.interface";
import { Request } from "./dtos/request.dto";

export class PlayerActionService {
	
	constructor(
		private readonly logger: Logger,
		private gameState: GameStateInterface,
	) {
	}

	public execute(request: Request) {
		try {
			this.logger.log(JSON.stringify(
				{
					"PlayerActionService has started": {
						"request": request,
					}
				}
			));

			this.gameState.updatePlayerSpeed(
				request.gameId,
				request.playerId,
				request.action,
			)

			this.logger.log(JSON.stringify(
				{
					"PlayerActionService has finished": {
						"response": "",
					}
				}
			));
		} catch (error) {
			this.logger.error("An error occurred on player action service");
		}
	}
}
