import { ConsoleLogger, Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server } from "http";
import { JoinGameService } from "src/core/projects/game/joinGame/join.game.service";
import MemoryGameStateAdapter from "./memory.game.state.adapter";
import { Response as JoinGameResponse } from "src/core/projects/game/joinGame/dtos/response.dto";
import { Request as JoinGameRequest } from "src/core/projects/game/joinGame/dtos/request.dto";
import PlayerConfig from "src/core/projects/game/shared/entities/player.config";
import MemoryQueueAdapter from "./memory.queue.adapter";
import { HandleGameService } from "src/core/projects/game/handleGame/handle.game.service";
import { PlayerActionService } from "src/core/projects/game/playerAction/player.action.service";
import { Request as PlayerActionRequest } from "src/core/projects/game/playerAction/dtos/request.dto";
import { HandleDisconnectService } from "src/core/projects/game/handleDisconnect/handle.disconnect.service";
import { MemoryClientManagerAdapter } from "./memory.client.manager.adapter";
import { Request as HandleDisconnectRequest} from "src/core/projects/game/handleDisconnect/dtos/request.dto";
import { Response as HandleDisconnectResponse} from "src/core/projects/game/handleDisconnect/dtos/response.dto";
import { HandleFinishedGameService } from "src/core/projects/game/handleFinishedGame/handle.finished.game.service";
import { Response as HandleFinishedGameResponse} from "src/core/projects/game/handleFinishedGame/dtos/response.dto";
import GameState from "src/core/projects/game/shared/entities/game.state";

@WebSocketGateway({
	namespace: '/game',
	cors: '*',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	public waitingQueue: MemoryQueueAdapter;
	public playingQueue: MemoryQueueAdapter;
	public gameStateManager: MemoryGameStateAdapter;
	public clientManager: MemoryClientManagerAdapter;

	@WebSocketServer()
	server: Server;

	constructor(
	) {
		this.waitingQueue = new MemoryQueueAdapter();
		this.gameStateManager = new MemoryGameStateAdapter();
		this.clientManager = new MemoryClientManagerAdapter();

		this.handleGame();
		this.handleFinishedGame();
	}

	//Handles Join Game Socket
	@SubscribeMessage('joinGame')
	joinGame(
		@MessageBody() uuid: string | number,
		@ConnectedSocket() client: any,
	): void {
		try {
			const joinGameService: JoinGameService = new JoinGameService(
				new Logger(),
				this.clientManager,
				this.waitingQueue,
				this.gameStateManager,
			);
			
			const request: JoinGameRequest = new JoinGameRequest(
				new PlayerConfig(uuid, client.id),
			);
			const response: JoinGameResponse = joinGameService.execute(request);

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
			//could see error messages here
		}
	}

	public async handleFinishedGame() {
		try {
			const handleFinishedGameService: HandleFinishedGameService = new HandleFinishedGameService(
				new Logger(),
				this.gameStateManager,
				this.clientManager,
			);

			while (true) {
				const response: HandleFinishedGameResponse = await handleFinishedGameService.finishGameLoop();
				if (response.gameStates.length) {
					await Promise.all(
						response.gameStates.map(async (gameState: GameState) => {
						await this.server.emit(gameState.id, gameState);
					}));
				}
				await new Promise(resolve => setTimeout(resolve, 300));
			}

		} catch (error) {
			//could see messages here
		}
	}

	@SubscribeMessage('playerAction')
	playerAction(@MessageBody() data: {gameId: string | number, playerId: string | number, action: string}) {
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

	handleConnection(client: any, ...args: any[]) {
		console.log(`Client connected from game: ${client.id}`);
	}

	handleDisconnect(client: any) {
		try {
			console.log(`Client disconnected from game: ${client.id}`);
			const handleDisconnectService: HandleDisconnectService = new HandleDisconnectService(
				new Logger(),
				this.clientManager,
				this.gameStateManager,
			);

			const request: HandleDisconnectRequest = new HandleDisconnectRequest(
				client.id
			);

			const response: HandleDisconnectResponse =  handleDisconnectService.execute(request);
			this.server.emit(response.gameState.id, response.gameState);
		} catch (error) {
			//could see messages here
		}
	}

}
