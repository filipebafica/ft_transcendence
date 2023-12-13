import GameState from "../entities/game.state";

export interface GameStateInterface {
	getGame(gameId: number): GameState
	createGame(playerId: number, playerName: string): Promise<GameState>
	closeDisconnectedGame(gameId: number, disconnectedId: number): Promise<GameState | undefined>
	updateGame(gameId: number, newGameState: GameState): Promise<void>
	createSecondPlayer(playerId: number, gameId: number, playerName: string): Promise<GameState>
	waitAllUpdatesToComplete(updatePromises: Promise<void>[]): Promise<void[]>
	collectUpdatePromises(): Promise<void>[]
	delay(): Promise<void>
	updatePlayerSpeed(gameId: number, playerId: number, action: string): void
	getFinishedGames(): GameState[]
	deleteFinishedGame(gameState: GameState): void
}
