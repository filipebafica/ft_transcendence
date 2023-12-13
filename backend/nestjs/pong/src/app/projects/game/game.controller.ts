import { Controller, Get, Logger, Param } from "@nestjs/common";
import { ListByUserIdService } from "src/core/projects/game/matchHistory/listByUserId/list.by.user.id.service";
import { Request as GetWinnerByGameIdRequest } from "src/core/projects/game/matchHistory/getWinnerByGameId/dtos/request.dto";
import { Response as GetWinnerByGameIdResponse } from "src/core/projects/game/matchHistory/getWinnerByGameId/dtos/response.dto";
import { GetWinnerByGameIdService } from "src/core/projects/game/matchHistory/getWinnerByGameId/get.winner.by.gameid.service";
import { Request as ListByUserIdRequest} from "src/core/projects/game/matchHistory/listByUserId/dtos/request.dto";
import { Response as ListByUserIdResponse } from "src/core/projects/game/matchHistory/listByUserId/dtos/response.dto";
import { GameHistoryAdapter } from "./game.history.adapter";
import { EntityManager } from "typeorm";

@Controller('/game')
export class GameController {
	private gameHistoryAdapter: GameHistoryAdapter;
	private logger: Logger;
	private getWinnerByGameIdService: GetWinnerByGameIdService;
	private listByUserIdService: ListByUserIdService;

	constructor(
		private readonly entityManager: EntityManager
	){
		this.gameHistoryAdapter = new GameHistoryAdapter(entityManager);
		this.logger = new Logger();

		this.getWinnerByGameIdService = new GetWinnerByGameIdService(
			this.logger,
			this.gameHistoryAdapter,
		);

		this.listByUserIdService = new ListByUserIdService(
			this.logger,
			this.gameHistoryAdapter,
		);
	}

	@Get('/:gameId/winner')
	public async getWinnerByGameId(
		@Param('gameId') gameId: number
	) {
		try {
			const request: GetWinnerByGameIdRequest = new GetWinnerByGameIdRequest(gameId);
			const response: GetWinnerByGameIdResponse = await this.getWinnerByGameIdService.execute(
				request
			);

			return response.toJson();
		} catch (error) {
			console.log("[CONTROLLER] Error happened when trying to get winner by id")
		}
	}

	@Get('/list/:userId')
	public async listByUserId(
		@Param('userId') userId: number
	) {
		try {
			const request: ListByUserIdRequest = new ListByUserIdRequest(userId);

			const response: ListByUserIdResponse = await this.listByUserIdService.execute(request);

			return response.toJson();
		} catch (error) {
			console.log("[ CONTROLLER] Error happened when trying to list match history by user id");
		}
	}
}
