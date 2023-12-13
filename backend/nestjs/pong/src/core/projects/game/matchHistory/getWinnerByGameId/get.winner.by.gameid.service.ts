import { Logger } from "@nestjs/common";
import { Response } from "./dtos/response.dto";
import { Request } from "./dtos/request.dto";
import { Winner } from "./entities/winner";
import { SelectWinnerByDisconnectRule } from "./rules/select.winner.by.disconnect.rule";
import { SelectWinnerRule } from "./rules/select.winner.rule";
import { GameHistoryRepository } from "../../shared/interfaces/game.history.repository";
import { GameHistoryDTO } from "../../shared/dtos/game.history.dto";

export class GetWinnerByGameIdService {
	private selectWinnerByDisconnectRule: SelectWinnerByDisconnectRule;
	private selectWinnerRule: SelectWinnerRule;

	constructor(
		private readonly logger: Logger,
		private gameHistoryRepository: GameHistoryRepository,
	) {
		this.selectWinnerByDisconnectRule =  new SelectWinnerByDisconnectRule();
		this.selectWinnerRule = new SelectWinnerRule();
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
			const gameHistory: GameHistoryDTO = await this.gameHistoryRepository.getByGameId(request.gameId);
			let response: Response;
			let winner: Winner;

			if (gameHistory.disconnectedId) {
				
				if (gameHistory.player1Id == null || gameHistory.player2Id == null) {
					response = new Response("cancelled");
				} else {
					winner = this.selectWinnerByDisconnectRule.apply(
						gameHistory.disconnectedId,
						gameHistory.player1Id,
						gameHistory.player2Id,
					);
					response = new Response("disconnect", winner);
				}

			} else if (gameHistory.player1Score == gameHistory.player2Score) {
				response = new Response("draw");
			} else {
				winner = this.selectWinnerRule.apply(
					gameHistory.player1Id,
					gameHistory.player1Score,
					gameHistory.player2Id,
					gameHistory.player2Score,
				);
				response = new Response("normal", winner);
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
