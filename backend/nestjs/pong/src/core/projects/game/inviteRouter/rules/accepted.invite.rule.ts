import { MessageEmitterAdapter } from "src/app/projects/game/message.emitter.adapter";
import { InviteStatus } from "../../shared/enums/invite.status";
import { InvitationRepository } from "../../shared/interfaces/invitation.repository";
import { Request } from "../dtos/request.dto";
import { GameStateInterface } from "../../shared/interfaces/game.state.interface";
import GameState from "../../shared/entities/game.state";
import { ClientManagerInterface } from "../../shared/interfaces/client.manager.interface";
import { InviteDTO } from "../dtos/invite.dto";

export class AcceptedInviteRule {
	constructor(
		private invitationRegister: InvitationRepository,
		private messageEmitter: MessageEmitterAdapter,
		private gameManager: GameStateInterface,
		private clientManager: ClientManagerInterface,
	){}

	/**
	 * @brief This rule is responsible for:
	 * Create a private game, add it to opened game map (the game starts running), add it to game history table
	 * Send the GameId for the players trough socket
	 * Add the socketid of both players on the table to controll join games
	 * Update the invitation
	 */
	public async apply(request: Request, inviteStatus: InviteStatus) {
		const mockePlayerOneName: string = "PlayerOne";
		const mockedPlayerTwoName: string = "PlayerTwo";
		const gameState: GameState = await this.gameManager.createPrivateGame(
			request.message.data.to,
			mockePlayerOneName,
			request.message.data.from,
			mockedPlayerTwoName,
		);

		const message: string = JSON.stringify({
			meta: "game",
			data: gameState.id
		});
		this.messageEmitter.emit(`${request.message.data.to.toString()}-invite`, message);
		this.messageEmitter.emit(`${request.message.data.from.toString()}-invite`, message);

		const invite: InviteDTO = await this.invitationRegister.getOpenedInvite(
			request.message.data.to,
			request.message.data.from
		);

		await this.clientManager.addClientGameMask(
			invite.sender_socket_id,
			invite.sender_id,
			gameState.id,
		);

		await this.clientManager.addClientGameMask(
			request.socketId,
			invite.receiver_id,
			gameState.id,
		);

		await this.invitationRegister.updateInvite(
			request.message.data.to,
			request.message.data.from,
			request.socketId,
			inviteStatus,
			gameState.id,
		);
	}
}

