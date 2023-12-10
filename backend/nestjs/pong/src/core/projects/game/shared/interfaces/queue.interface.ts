export interface QueueInterface {
	isOnQueue(playerID: string): boolean;
	add(playerID: string, gameID: string): void;
	remove(playerID: string): void;
	isEmpty(): boolean;
	first(): [string, string]
}
