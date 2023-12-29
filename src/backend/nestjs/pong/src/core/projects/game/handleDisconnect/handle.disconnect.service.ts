import { Logger } from "@nestjs/common";
import { GameStateInterface } from "../shared/interfaces/game.state.interface";
import { ClientManagerInterface } from "../shared/interfaces/client.manager.interface";
import { Request } from "./dtos/request.dto";
import GameState from "../shared/entities/game.state";
import { Response } from "./dtos/response.dto";
import { UnavailableGameIdException } from "./exceptions/unavailable.gameid.exception";
import { ClientIsNotPlayingException } from "./exceptions/unavailable.gamemask.exception";
import { QueueInterface } from "../shared/interfaces/queue.interface";
import { InvitationRegisterAdapter } from "src/app/projects/game/invitation.register.adapter";
import { RejectedInviteRule } from "../inviteRouter/invite/rules/rejected.invite.rule";
import { MessageEmitterAdapter } from "src/app/projects/game/message.emitter.adapter";
import { InvitationRepository } from "../shared/interfaces/invitation.repository";

export class HandleDisconnectService {

	constructor(
		private readonly logger: Logger,
		private clientManager: ClientManagerInterface,
		private gameState: GameStateInterface,
		private waitingQueue: QueueInterface,
		private invitationRegister: InvitationRepository,
	) {
	}

	public async execute(request: Request): Promise<Response> {
		try {
			this.logger.log(JSON.stringify(
				{
					"HandleDisconnectService has started": {
						"request": request,
					}
				}
			));

			const gameId: number = await this.clientManager.getClientGameIdMask(request.clientId);
			if (gameId === undefined) {
				throw new ClientIsNotPlayingException({ key: "gameId", value: request.clientId });
			}

			const disconnectedId: number = await this.clientManager.getClientPlayerIdMask(request.clientId);
			const gameState: GameState = await this.gameState.closeDisconnectedGame(gameId, disconnectedId);

			if (gameState == undefined) {
				throw new UnavailableGameIdException({ key: "gameId", value: gameId.toString() });
			}
			this.clientManager.removeClientGameMask(gameState.id);

			if (await this.waitingQueue.isOnQueue(disconnectedId) == true) {
				await this.waitingQueue.removeByGameId(gameState.id);
			}

			await this.invitationRegister.removeOpenedInviteById(disconnectedId);

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
