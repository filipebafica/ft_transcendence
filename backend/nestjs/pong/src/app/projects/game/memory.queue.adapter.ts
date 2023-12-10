import { Injectable } from "@nestjs/common";
import { QueueInterface } from "src/core/projects/game/shared/interfaces/queue.interface";


@Injectable()
export default class MemoryQueueAdapter implements QueueInterface {
	private queue: Map<string, string> = new Map<string, string>();

	public isOnQueue(playerID: string): boolean {
		return this.queue.has(playerID);
	}

	public add(playerID: string, gameID: string): void {
		this.queue.set(playerID, gameID);
	}

	public remove(playerID: string): void {
		this.queue.delete(playerID);
	}

	public isEmpty(): boolean {
		if (!this.queue.size) {
			return true; 
		}
		return false;
	}

	public first(): [string, string] | undefined {
		const entriesArray = [...this.queue.entries()];

		if (entriesArray.length === 0) {
		  return undefined; // Return undefined if the map is empty
		}
	
		return entriesArray[0];
	}
}
