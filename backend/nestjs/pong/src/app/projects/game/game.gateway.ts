import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "socket.io";
import { JoinGameService } from "src/core/projects/game/joinGame/join.game.service";
import { Response as JoinGameResponse } from "src/core/projects/game/joinGame/dtos/response.dto";
import { Request as JoinGameRequest } from "src/core/projects/game/joinGame/dtos/request.dto";
import { HandleGameService } from "src/core/projects/game/handleGame/handle.game.service";
import { PlayerActionService } from "src/core/projects/game/playerAction/player.action.service";
import { Request as PlayerActionRequest } from "src/core/projects/game/playerAction/dtos/request.dto";
import { HandleDisconnectService } from "src/core/projects/game/handleDisconnect/handle.disconnect.service";
import { Request as HandleDisconnectRequest} from "src/core/projects/game/handleDisconnect/dtos/request.dto";
import { Response as HandleDisconnectResponse} from "src/core/projects/game/handleDisconnect/dtos/response.dto";
import { HandleFinishedGameService } from "src/core/projects/game/handleFinishedGame/handle.finished.game.service";
import { Response as HandleFinishedGameResponse} from "src/core/projects/game/handleFinishedGame/dtos/response.dto";
import GameState from "src/core/projects/game/shared/entities/game.state";
import { GameHistoryAdapter } from "./game.history.adapter";
import { EntityManager } from "typeorm";
import { ClientManagerAdapter } from "./client.manager.adapter";
import { WaitingQueueAdapter } from "./waiting.queue.adapter";
import { Socket } from "socket.io";
import GameStateAdapter from "./game.state.adapter";
import { MessageEmitterAdapter } from "./message.emitter.adapter";
import { InviteService } from "src/core/projects/game/inviteRouter/invite/invite.service";
import { InviteMessageDTO as InviteMessageDTO } from "./invite.message.dto";
import { Request as InviteRequest } from "src/core/projects/game/inviteRouter/invite/dtos/request.dto";
import { InvitationRegisterAdapter } from "./invitation.register.adapter";
import { JoinMessageDTO } from "./join.message.dto";
import { CustomizeGameService } from "src/core/projects/game/inviteRouter/customize/customize.game.service";
import { CustomizeMessageDTO } from "./customize.message.dto";
import { Request as CustomizeGameServiceRequest} from "src/core/projects/game/inviteRouter/customize/dtos/request.dto";

@WebSocketGateway({
	path: '/websocket/game',
	cors: {
		origin: '*',
	},
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
	private waitingQueue: WaitingQueueAdapter;
	private gameStateManager: GameStateAdapter;
	private gameHistoryAdapter: GameHistoryAdapter;
	private clientManagerAdapter: ClientManagerAdapter;
	private messageEmitterAdapter: MessageEmitterAdapter;
	private invitationRegisterAdapter: InvitationRegisterAdapter;

	@WebSocketServer()
	server: Server;

	constructor(
		private readonly entityManager: EntityManager,
	) {
		this.gameHistoryAdapter = new GameHistoryAdapter(entityManager);

		this.clientManagerAdapter = new ClientManagerAdapter(entityManager);
		this.waitingQueue = new WaitingQueueAdapter(entityManager);
		this.gameStateManager = new GameStateAdapter(this.gameHistoryAdapter);
		this.messageEmitterAdapter = new MessageEmitterAdapter(this.server);
		this.invitationRegisterAdapter = new InvitationRegisterAdapter(entityManager);
	}

	afterInit() {
		this.messageEmitterAdapter = new MessageEmitterAdapter(this.server);
		this.handleGame();
		this.handleFinishedGame();
	}

	//Handles Join Game Socket
	@SubscribeMessage('joinGame')
	public async joinGame(
		@MessageBody() message: string,
		@ConnectedSocket() client: Socket,
	): Promise<void> {
		try {
			const joinGameService: JoinGameService = new JoinGameService(
				new Logger(JoinGameService.name),
				this.clientManagerAdapter,
				this.waitingQueue,
				this.gameStateManager,
			);

			const joinMessageDTO: JoinMessageDTO  = JSON.parse(message);

			const response: JoinGameResponse = await joinGameService.execute(
				new  JoinGameRequest(
					client.id,
					joinMessageDTO,
				)
			);

			this.server.emit(joinMessageDTO.uuid.toString(), response.gameState.id);
		}
		catch (error) {
			console.log(`COULDN'T JOIN THE GAME: ${[error.message]}`);
		}
	}

	public async handleGame() {
		try {
			const handleGameService: HandleGameService = new HandleGameService(
				this.gameStateManager,
			);
			
			while (true) {
				await handleGameService.gameLoop();
				let games = this.gameStateManager.getGames();

				for (const [gameId, gameState] of games) {
					this.server.emit(gameId.toString(), gameState);
				}
			}
		} catch (error) {
			console.log(`ERROR HANDLING GAME: ${[error.message]}`);
		}
	}

	public async handleFinishedGame() {
		try {
			const handleFinishedGameService: HandleFinishedGameService = new HandleFinishedGameService(
				new Logger(),
				this.gameStateManager,
				this.clientManagerAdapter,
			);

			while (true) {
				const response: HandleFinishedGameResponse = await handleFinishedGameService.finishGameLoop();
				if (response.gameStates.length) {
					await Promise.all(
						response.gameStates.map(async (gameState: GameState) => {
						await this.server.emit(gameState.id.toString(), gameState);
					}));
				}
				await new Promise(resolve => setTimeout(resolve, 300));
			}

		} catch (error) {
			console.log(`ERROR FINISHING GAME: ${[error.message]}`);
		}
	}

	@SubscribeMessage('playerAction')
	public playerAction(
		@MessageBody() data: {
			gameId: number,
			playerId: number,
			action: string
		}) {
		try {
			console.log(data.action);
			const playerActionService: PlayerActionService = new PlayerActionService(
				new Logger(),
				this.gameStateManager,
			)

			const request: PlayerActionRequest = new PlayerActionRequest(
				data.playerId,
				data.gameId,
				data.action,
			);

			playerActionService.execute(request);
		} catch (error) {
			console.log(`COULDN'T MOVE PLAYER: ${error.message}`)
		}
	}

	@SubscribeMessage('inviteRouter')
	public async inviteRouter(
		@MessageBody() message: string,
		@ConnectedSocket() client: Socket,
		) {
			try {
				const parsedMessage = JSON.parse(message);
				const messageType = this.getInviteRouterMessageType(parsedMessage);

				if (messageType == "invite") {
					const inviteService: InviteService = new InviteService(
						new Logger(InviteService.name),
						this.messageEmitterAdapter,
						this.gameStateManager,
						this.invitationRegisterAdapter,
						this.gameHistoryAdapter,
						this.waitingQueue,
						this.clientManagerAdapter,
					);
	
					const inviteMessageDTO: InviteMessageDTO = parsedMessage;
					await inviteService.execute(
						new InviteRequest(
							client.id,
							inviteMessageDTO,
						)
					);
				}

				if (messageType == "customize") {
					const customizeGameService: CustomizeGameService = new CustomizeGameService(
						new Logger(CustomizeGameService.name),
						this.gameStateManager,
						this.messageEmitterAdapter,
						this.waitingQueue,
					);

					const customizeMessageDTO: CustomizeMessageDTO = parsedMessage;
					await customizeGameService.execute(
						new CustomizeGameServiceRequest(
							client.id,
							customizeMessageDTO,
						)
					);
				}

			} catch (error) {
				console.log(`ERROR INVITING ROUTER: ${[error.message]}`)
			}
		}

	public handleConnection(client: Socket, ...args: any[]) {
		console.log(`Client connected from game: ${client.id}`);
	}

	public async handleDisconnect(client: Socket) {
		try {
			console.log(`Client disconnected from game: ${client.id}`);
			const handleDisconnectService: HandleDisconnectService = new HandleDisconnectService(
				new Logger(),
				this.clientManagerAdapter,
				this.gameStateManager,
				this.waitingQueue,
			);

			const request: HandleDisconnectRequest = new HandleDisconnectRequest(
				client.id
			);

			const response: HandleDisconnectResponse =  await handleDisconnectService.execute(request);
			this.server.emit(response.gameState.id.toString(), response.gameState);
		} catch (error) {
			console.log(`ERROR DISCONNECTING GAME: ${[error.message]}`);
		}
	}

	private getInviteRouterMessageType(parsedMessage: any): string {
		const messageType = parsedMessage?.meta;
		if (messageType == undefined || messageType == null) {
			throw Error("Invalid message type for InviteRouter");
		}

		if (messageType != "invite" && messageType != "customize") {
			throw Error("Invalid message type for InviteRouter");
		}

		return messageType;
	}

}
