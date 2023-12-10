import { Logger } from "@nestjs/common";
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

@WebSocketGateway({
	namespace: '/game',
	cors: '*',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
	public waitingQueue: MemoryQueueAdapter;
	public playingQueue: MemoryQueueAdapter;
	public gameStateManager: MemoryGameStateAdapter;

	@WebSocketServer()
	server: Server;

	constructor(
	) {
		this.waitingQueue = new MemoryQueueAdapter();
		this.playingQueue = new MemoryQueueAdapter();
		this.gameStateManager = new MemoryGameStateAdapter();

		this.handleGame();
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
				this.waitingQueue,
				this.playingQueue,
				this.gameStateManager,
			);
			
			const request: JoinGameRequest = new JoinGameRequest(
				new PlayerConfig(uuid, client.id),
			);
			const response: JoinGameResponse = joinGameService.execute(request);

			this.server.emit(uuid.toString(), response.gameState.id);
		}
		catch (error) {
			this.server.emit(uuid.toString(), JSON.stringify(
				{
					"COULDN'T JOIN THE GAME": [error.message],
				}
			));
		}
	}

	public async handleGame() {
		try {
			const handleGameService: HandleGameService = new HandleGameService(
				new Logger(),
				this.playingQueue,
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
			//ver mensagem de erro
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
			//ver mensagem de erro
		}
	}

	handleConnection(client: any, ...args: any[]) {
		console.log(`Client connected from game: ${client.id}`);
	}

	handleDisconnect(client: any) {
		console.log(`Client disconnected from game: ${client.id}`);
	}

}
