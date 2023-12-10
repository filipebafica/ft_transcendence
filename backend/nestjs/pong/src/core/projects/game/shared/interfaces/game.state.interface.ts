import GameState from "../entities/game.state";
import PlayerConfig from "../entities/player.config";

export interface GameStateInterface {
	createGame(playerId: string | number): GameState
	removeGame(gameId: string | number): void
	updateGame(gameId: string | number, newGameState: GameState): void
	createSecondPlayer(playerId: string | number, gameId: string | number): GameState
	waitAllUpdatesToComplete(updatePromises: Promise<void>[]): Promise<void[]>
	collectUpdatePromises(): Promise<void>[]
	delay(): Promise<void>
	updatePlayerSpeed(gameId: string | number, playerId: string | number, action: string): void
}
