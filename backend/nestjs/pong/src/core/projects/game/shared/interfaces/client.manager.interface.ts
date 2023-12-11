export interface ClientManagerInterface {
	addClientGameMask(clientId: any, gameId: string): void
	removeGameMask(gameId: string, clientId?: any): void
	getClientGameMask(clientId: any): string | undefined
}
