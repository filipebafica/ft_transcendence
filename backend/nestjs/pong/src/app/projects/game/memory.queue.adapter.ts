import { Injectable } from "@nestjs/common";
import { QueueInterface } from "src/core/projects/game/shared/interfaces/queue.interface";


@Injectable()
export default class MemoryQueueAdapter implements QueueInterface {
	private queue: Map<string | number, string | number> = new Map<string | number, string | number>();

	public isOnQueue(playerId: string | number): boolean {
		return this.queue.has(playerId);
	}

	public add(playerId: string | number, gameId: string | number): void {
		this.queue.set(playerId, gameId);
	}

	public remove(playerId: string | number): void {
		this.queue.delete(playerId);
	}

	public isEmpty(): boolean {
		if (!this.queue.size) {
			return true; 
		}
		return false;
	}

	public first(): [string | number, string | number] | undefined {
		const entriesArray = [...this.queue.entries()];

		if (entriesArray.length === 0) {
		  return undefined; // Return undefined if the map is empty
		}
	
		return entriesArray[0];
	}
}
