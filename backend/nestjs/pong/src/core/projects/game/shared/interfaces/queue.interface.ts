import { WaitingPlayerDTO } from "../dtos/waiting.player.dto";

export interface QueueInterface {
	isOnQueue(playerId: number): Promise<boolean>;
	add(playerId: number, gameId: number): void;
	remove(playerId: number): void;
	first(): Promise<WaitingPlayerDTO | null>;
}
