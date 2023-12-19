import GameState from "../entities/game.state";
import { PlayerCustomization } from "../entities/player.customization";

export interface GameStateInterface {
	getGame(
		gameId: number,
	): GameState

	createGame(
		playerId: number,
		customization: PlayerCustomization,
		playerName: string,
	): Promise<GameState>

	closeDisconnectedGame(
		gameId: number,
		disconnectedId: number
	): Promise<GameState | undefined>

	updateGame(
		gameId: number,
		newGameState: GameState,
	): Promise<void>

	createSecondPlayer(
		playerId: number,
		customization: PlayerCustomization,
		gameId: number,
		playerName: string,
	): Promise<GameState>

	waitAllUpdatesToComplete(
		updatePromises: Promise<void>[],
	): Promise<void[]>

	collectUpdatePromises(
	): Promise<void>[]

	delay(	
	): Promise<void>

	updatePlayerSpeed(
		gameId: number,
		playerId: number,
		action: string,
	): void

	getFinishedGames(
	): GameState[]

	deleteFinishedGame(
		gameState: GameState
	): void

	createPrivateGame(
		playerOneId: number,
		playerOneName: string,
		playerTwoId: number,
		playerTwoName: string,
	): Promise<GameState>

	updateGameWithCustomization(
		playerId: number,
		gameId: number,
		customization: PlayerCustomization,
	): Promise<GameState>
}
