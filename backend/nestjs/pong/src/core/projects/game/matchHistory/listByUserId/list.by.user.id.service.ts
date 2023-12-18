import { Logger } from "@nestjs/common";
import { Request } from "./dtos/request.dto";
import { Response } from "./dtos/response.dto";
import { GameHistoryRepository } from "../../shared/interfaces/game.history.repository";

export class ListByUserIdService {

	constructor(
		private readonly logger: Logger,
		private gameHistoryRepository: GameHistoryRepository,
	){}

	public async execute(request: Request): Promise<Response> {
		try {
			this.logger.log(JSON.stringify(
				{
					"ListByUserIdService has started": {
						"request": request,
					}
				}
			));

			const result = await this.gameHistoryRepository.listAndCountMatchesByUserId(request.userId, request.index);
			const response: Response = new Response(
				result.games,
				result.pages,
			);

			this.logger.log(JSON.stringify(
				{
					"ListByUserIdService has finished": {
						"response": response,
					}
				}
			));
			return response;
		} catch (error) {
			this.logger.error("[SERVICE] An error occurred when listing game history by user id");
			throw error;
		}
	}
}
