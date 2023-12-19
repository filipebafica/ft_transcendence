import { WaitingPlayerDTO } from "../dtos/waiting.player.dto";
import { GameType } from "../enums/game.type";

export interface QueueInterface {
	isOnQueue(
		playerId: number
	): Promise<boolean>;

	add(
		playerId: number,
		gameType: GameType,
		gameId?: number,
	): Promise<void>;

	remove(
		playerId: number
	): Promise<void>;

	first(
	): Promise<WaitingPlayerDTO | null>;

	updateToReady(
		playerId: number,
	): Promise<void>

	getPlayerStatus(
		gameId: number,
		playerId: number,
	): Promise<string>
}
