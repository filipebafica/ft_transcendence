import { WaitingPlayerDTO } from "../dtos/waiting.player.dto";
import { GameType } from "../enums/game.type";

export interface QueueInterface {
	isOnQueue(playerId: number): Promise<boolean>;
	add(playerId: number, gameType: GameType, gameId?: number, ): void;
	remove(playerId: number): void;
	first(): Promise<WaitingPlayerDTO | null>;
}
