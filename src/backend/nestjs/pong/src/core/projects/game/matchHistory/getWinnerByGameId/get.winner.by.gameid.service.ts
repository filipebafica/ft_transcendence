import { Logger } from "@nestjs/common";
import { Response } from "./dtos/response.dto";
import { Request } from "./dtos/request.dto";
import { GameHistoryRepository } from "../../shared/interfaces/game.history.repository";

export class GetWinnerByGameIdService {

	constructor(
		private readonly logger: Logger,
		private gameHistoryRepository: GameHistoryRepository,
	) {
	}

	public async execute(request: Request): Promise<Response> {
		try {
			this.logger.log(JSON.stringify(
				{
					"PlayerActionService has started": {
						"request": request,
					}
				}
			));

			let response: Response;
			const winnerId: number | null = await this.gameHistoryRepository.getWinnerByGameId(request.gameId);
			if (winnerId == null) {
				response = new Response("draw");
			} else {
				response = new Response("normal", winnerId);
			}

			this.logger.log(JSON.stringify(
				{
					"GetWinnerByGameIdService has finished": {
						"request": response,
					}
				}
			));
			return response;
		} catch (error) {
			this.logger.error("[SERVICE] An error occurred when getting winner by id");
			throw error;
		}
	}
}
