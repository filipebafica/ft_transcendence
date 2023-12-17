import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "http";
import { JoinGameService } from "src/core/projects/game/joinGame/join.game.service";
import { Response as JoinGameResponse } from "src/core/projects/game/joinGame/dtos/response.dto";
import { Request as JoinGameRequest } from "src/core/projects/game/joinGame/dtos/request.dto";
import PlayerConfig from "src/core/projects/game/shared/entities/player.config";
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

@WebSocketGateway({
	path: '/websocket/game',
	cors: {
		origin: '*',
	},
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private waitingQueue: WaitingQueueAdapter;
	private gameStateManager: GameStateAdapter;
	private gameHistoryAdapter: GameHistoryAdapter;
	private clientManagerAdapter: ClientManagerAdapter;

	@WebSocketServer()
	server: Server;

	constructor(
		private readonly entityManager: EntityManager,
	) {
		this.gameHistoryAdapter = new GameHistoryAdapter(entityManager);

		this.clientManagerAdapter = new ClientManagerAdapter(entityManager);
		this.waitingQueue = new WaitingQueueAdapter(entityManager);
		this.gameStateManager = new GameStateAdapter(this.gameHistoryAdapter);

		this.handleGame();
		this.handleFinishedGame();
	}

	//Handles Join Game Socket
	@SubscribeMessage('joinGame')
	public async joinGame(
		@MessageBody() uuid: number,
		@ConnectedSocket() client: Socket,
	): Promise<void> {
		try {
			const joinGameService: JoinGameService = new JoinGameService(
				new Logger(),
				this.clientManagerAdapter,
				this.waitingQueue,
				this.gameStateManager,
			);

			const request: JoinGameRequest = new JoinGameRequest(
				new PlayerConfig(uuid, client.id),
			);
			const response: JoinGameResponse = await joinGameService.execute(request);

			console.log(`GAMESTATE_ID: ${response.gameState.id}`);
			console.log(`TYPEOF: ${typeof(response.gameState.id)}`)
			this.server.emit(uuid.toString(), response.gameState.id);
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

}
