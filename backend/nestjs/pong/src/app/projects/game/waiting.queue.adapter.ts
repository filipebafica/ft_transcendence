import { Injectable, Logger } from "@nestjs/common";
import { WaitingQueue } from "src/app/entities/waiting.queue.entity";
import { WaitingPlayerDTO } from "src/core/projects/game/shared/dtos/waiting.player.dto";
import { QueueInterface } from "src/core/projects/game/shared/interfaces/queue.interface";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export class WaitingQueueAdapter implements QueueInterface {
	private op: string = "[WaitingQueueAdapter]";

	private waitingQueueRepository: Repository<WaitingQueue>;

	constructor(
		private readonly entityManager: EntityManager,
	) {
		this.waitingQueueRepository = entityManager.getRepository(WaitingQueue);
	}

	public async isOnQueue(
	playerId: number
	): Promise<boolean> {
		try {
			const result: WaitingQueue = await this.waitingQueueRepository.findOne({
				where: {player_id: playerId},
			});

			if (result == undefined) {
				return false;
			}

			return true;
		} catch (error) {
			throw error;
		}
	}

	public async add(
	playerId: number,
	gameId: number,
	): Promise<void> {
		try {
			let entity: WaitingQueue = this.waitingQueueRepository.create({
				player_id: playerId,
				game_id: gameId,
			});
	
			entity = await this.waitingQueueRepository.save(entity);
		} catch (error) {
			throw error;
		}
	}

	public async remove(
	playerId: number
	): Promise<void> {
		try {
			await this.waitingQueueRepository
			.createQueryBuilder()
			.delete()
			.where("player_id = :playerId", { playerId })
			.execute();

		} catch (error) {
			throw error;
		}
	}

	public async first(): Promise<WaitingPlayerDTO | null> {
		try {
			const result: WaitingQueue = await this.waitingQueueRepository
			.createQueryBuilder()
			.where('player_id IS NOT NULL')
			.orderBy('created_at', 'ASC')
			.getOne();

			if (result == undefined) {
				return null;
			}

			return this.mapToWaitingPlayerDTO(result);
		} catch (error) {
			throw error;
		}
	}

	private mapToWaitingPlayerDTO(entity: WaitingQueue): WaitingPlayerDTO {
		return new WaitingPlayerDTO(entity.player_id, entity.game_id);
	  }
}