export interface QueueInterface {
	isOnQueue(playerId: string | number): boolean;
	add(playerId: string | number, gameId: string | number): void;
	remove(playerId: string | number): void;
	isEmpty(): boolean;
	first(): [string | number, string | number]
}
