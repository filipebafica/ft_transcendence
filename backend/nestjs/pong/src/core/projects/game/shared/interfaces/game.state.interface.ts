import GameState from "../entities/game.state";

export interface GameStateInterface {
	getGame(gameId: string): GameState
	createGame(playerId: string | number, playerName: string): GameState
	closeGame(gameId: string): GameState | undefined
	updateGame(gameId: string | number, newGameState: GameState): void
	createSecondPlayer(playerId: string | number, gameId: string | number, playerName: string): GameState
	waitAllUpdatesToComplete(updatePromises: Promise<void>[]): Promise<void[]>
	collectUpdatePromises(): Promise<void>[]
	delay(): Promise<void>
	updatePlayerSpeed(gameId: string | number, playerId: string | number, action: string): void
	getFinishedGames(): GameState[]
	deleteFinishedGame(gameState: GameState): void
}
