import GameState from "../entities/game.state";
import PlayerConfig from "../entities/player.config";

export interface GameStateInterface {
	createGame(playerID: string): GameState
	removeGame(gameID: string): void
	updateGame(gameID: string, newGameState: GameState): void
	createSecondPlayer(playerID: string, gameID: string): GameState
	waitAllUpdatesToComplete(updatePromises: Promise<void>[]): Promise<void[]>
	collectUpdatePromises(): Promise<void>[]
	delay(): Promise<void>
	updatePlayerSpeed(gameID: string, playerID: string, action: string): void
}
