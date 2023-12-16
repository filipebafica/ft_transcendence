export interface ClientManagerInterface {
	addClientGameMask(clientId: string, playerId: number, gameId: number): Promise<void>
	removeClientGameMask(gameId: number): Promise<void>
	getClientGameIdMask(clientId: string): Promise<number>
	getClientPlayerIdMask(clientId: string): Promise<number>
	hasMask(clientId: string): Promise<boolean>
}
