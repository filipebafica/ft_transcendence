import { Controller, Get, Logger, Param } from "@nestjs/common";
import { ListByUserIdService } from "src/core/projects/game/matchHistory/listByUserId/list.by.user.id.service";
import { Request as GetWinnerByGameIdRequest } from "src/core/projects/game/matchHistory/getWinnerByGameId/dtos/request.dto";
import { Response as GetWinnerByGameIdResponse } from "src/core/projects/game/matchHistory/getWinnerByGameId/dtos/response.dto";
import { GetWinnerByGameIdService } from "src/core/projects/game/matchHistory/getWinnerByGameId/get.winner.by.gameid.service";
import { Request as ListByUserIdRequest} from "src/core/projects/game/matchHistory/listByUserId/dtos/request.dto";
import { Response as ListByUserIdResponse } from "src/core/projects/game/matchHistory/listByUserId/dtos/response.dto";
import { GameHistoryAdapter } from "./game.history.adapter";
import { EntityManager } from "typeorm";
import { ListStatsByUserIdService } from "src/core/projects/game/stats/listByUserId/list.stats.by.user.id.service";
import { RequestDTO as ListStatsByUserIdServiceRquestDTO } from 'src/core/projects/game/stats/listByUserId/dtos/request.dto';


@Controller('/game')
export class GameController {
	private gameHistoryAdapter: GameHistoryAdapter;
	private logger: Logger;
	private getWinnerByGameIdService: GetWinnerByGameIdService;
	private listByUserIdService: ListByUserIdService;
	private listStatsByUserIdService: ListStatsByUserIdService;

	constructor(
		private readonly entityManager: EntityManager
	){
		this.gameHistoryAdapter = new GameHistoryAdapter(entityManager);

		this.getWinnerByGameIdService = new GetWinnerByGameIdService(
			new Logger(GetWinnerByGameIdService.name),
			this.gameHistoryAdapter,
		);

		this.listByUserIdService = new ListByUserIdService(
			new Logger(ListByUserIdService.name),
			this.gameHistoryAdapter,
		);

		this.listStatsByUserIdService = new ListStatsByUserIdService(
			new Logger(ListStatsByUserIdService.name),
			this.gameHistoryAdapter,
		)
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

	@Get('/list/:userId/:index?')
	public async listByUserId(
		@Param('userId') userId: number,
		@Param('index') index: number | null = null
	) {
		try {
			const request: ListByUserIdRequest = new ListByUserIdRequest(userId, index);

			const response: ListByUserIdResponse = await this.listByUserIdService.execute(request);

			return response.toJson();
		} catch (error) {
			console.log("[ CONTROLLER] Error happened when trying to list match history by user id");
		}
	}

	@Get('/stats/:userId/')
	public async listStatsByUserId(
		@Param('userId') userId: string
	) {
		try {
			const response = await this.listStatsByUserIdService.execute(
				new ListStatsByUserIdServiceRquestDTO(parseInt(userId))
			);
			return response.toJson();
		} catch (error) {
			console.log("[ CONTROLLER] Error happened when trying to list game stats by user id");
		}
	}
}
