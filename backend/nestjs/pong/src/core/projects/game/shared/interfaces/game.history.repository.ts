import { GameHistoryDTO } from "../dtos/game.history.dto";

export interface GameHistoryRepository {
	getByGameId(
		gameId: number
	): Promise<GameHistoryDTO>;

	listMatchesByUserId(
		userId: number,
		index: number
	): Promise<GameHistoryDTO[]>;

	createGame(
		status: number,
		player1Score: number,
		player2Score: number,
		player1Id: number,
		player2Id?: number
	): Promise<number>;

	updateGameHistoryWithDisconnect(
		gameId: number,
		player1Score: number,
		player2Score: number,
		status: number,
		disconnectedId: number,
	): Promise<number>;

	updateGameHistoryWithSecondPlayer(
		gameId: number, 
		status: number, 
		playerId: number
	): Promise<void>;

	updateGameHistoryWithMaxScore(
		gameId: number,
		player1Score: number,
		player2Score: number,
		status: number,
	): Promise<number>;
}

//result can be draw, normal, disconnect
//user that was disconnected always lose
