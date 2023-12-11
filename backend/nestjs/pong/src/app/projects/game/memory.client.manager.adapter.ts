import { ClientManagerInterface } from "src/core/projects/game/shared/interfaces/client.manager.interface";

export class MemoryClientManagerAdapter implements ClientManagerInterface {
	private mask: Map<any, string> = new Map<any, string>();

	public addClientGameMask(clientId: any, gameId: string): void {
		this.mask.set(clientId, gameId);
	}

	public 	removeGameMask(gameId: string, clientId?: any): void {
		if (clientId !== undefined) {
			this.mask.delete(clientId);
		};

		for (const [key, value] of this.mask.entries()) {
			if (value === gameId) {
				this.mask.delete(key);
			}
		};
	}

	getClientGameMask(clientId: any): string | undefined {
		return this.mask.get(clientId);
	}
}
