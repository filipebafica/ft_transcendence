import { Logger } from "@nestjs/common";
import { AlreadyPlayerException as AlreadyPlayingException } from "./exceptions/already.playing.exception";
import { AlreadyWaitingException } from "./exceptions/already.waiting.exception";
import { Response } from "./dtos/response.dto";
import { Request } from "./dtos/request.dto";
import GameState from "../shared/entities/game.state";
import { GameStateInterface } from "../shared/interfaces/game.state.interface";
import { QueueInterface } from "../shared/interfaces/queue.interface";
import { ClientManagerInterface } from "../shared/interfaces/client.manager.interface";
import { WaitingPlayerDTO } from "../shared/dtos/waiting.player.dto";
import { GameType } from "../shared/enums/game.type";
import { UserRepository } from "../../authentication/login/gateway/user.info.repository";
import { GetUserNameRule } from "./rules/get.user.name.rule";

export class JoinGameService {
	private getUserNameRule: GetUserNameRule;

	constructor(
		private readonly logger: Logger,
		private clientManager: ClientManagerInterface,
		private waitingQueue: QueueInterface,
		private gameState: GameStateInterface,
		private userRepository: UserRepository,
	) {
		this.getUserNameRule = new GetUserNameRule(
			this.userRepository,
		)
	}

	public async execute(request: Request): Promise<Response> {
		try {
			this.logger.log(JSON.stringify(
				{
					"JoinGameService has started": {
						"request": request,
					}
				}
			));

			if (await this.clientManager.hasMask(request.socketId) == true) {
				throw new AlreadyPlayingException({key: "uuid", value: request.joinMessage.uuid});
			}

			if (await this.waitingQueue.isOnQueue(request.joinMessage.uuid) == true) {
				throw new AlreadyWaitingException({key: "uuid", value: request.joinMessage.uuid});
			}

			let response: Response;
			const waitingPlayer: WaitingPlayerDTO | null = await this.waitingQueue.first();
			if (waitingPlayer == null) {
				const playerOneName: string = await this.getUserNameRule.apply(
					request.joinMessage.uuid,
				);

				const gameState: GameState = await this.gameState.createGame(
					request.joinMessage.uuid,
					request.joinMessage.customization,
					playerOneName,
				);

				await this.waitingQueue.add(
					request.joinMessage.uuid,
					GameType.Public,
					gameState.id,
				);

				await this.clientManager.addClientGameMask(
					request.socketId,
					request.joinMessage.uuid,
					gameState.id,
				);

				response = new Response(gameState);
			} else {
				const playerTwoName: string = await this.getUserNameRule.apply(
					request.joinMessage.uuid,
				);

				await this.waitingQueue.remove(
					waitingPlayer.playerId,
				);

				const gameState: GameState = await this.gameState.createSecondPlayer(
					request.joinMessage.uuid,
					request.joinMessage.customization,
					waitingPlayer.gameId,
					playerTwoName,
				);

				await this.clientManager.addClientGameMask(
					request.socketId,
					request.joinMessage.uuid,
					gameState.id
				);

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
