import { Injectable, Logger } from "@nestjs/common";
import { WaitingQueue } from "src/app/entities/waiting.queue.entity";
import { WaitingPlayerDTO } from "src/core/projects/game/shared/dtos/waiting.player.dto";
import { GameType } from "src/core/projects/game/shared/enums/game.type";
import { PlayerStatus } from "src/core/projects/game/shared/enums/player.status";
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
	gameType: GameType,
	gameId: number | null = null,
	): Promise<void> {
		try {
			let entity: WaitingQueue = this.waitingQueueRepository.create({
				player_id: playerId,
				game_id: gameId,
				game_type: gameType,
				player_status: PlayerStatus.Waiting,
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

	public async updateToReady(
		playerId: number,
	): Promise<void> {
		try {
			const waitingQueueEntity = await this.waitingQueueRepository.findOne({
				where: {
					player_id: playerId,
					player_status: PlayerStatus.Waiting
				}
			});

			if (waitingQueueEntity == undefined) {
				throw Error("There is no such player waiting for game");
			}

			waitingQueueEntity.player_status = PlayerStatus.Ready;
			await this.waitingQueueRepository.save(waitingQueueEntity);
		} catch (error) {
			console.log("ERROR UPDATING WAITING STATUS");
			throw error;
		}
	}

	public async getPlayerStatus(
		gameId: number,
		playerId: number,
	): Promise<string> {
		try {
			const waitingQueueEntity = await this.waitingQueueRepository.findOne({
				select: ["player_status"],
				where: {
					player_id: playerId,
					game_id: gameId,
				}
			});

			if (waitingQueueEntity == undefined) {
				throw Error("There is no such player on the waiting queue");
			}

			const playerStatus: string = waitingQueueEntity.player_status;
			return playerStatus;
		} catch (error) {
			console.log("ERROR WHEN TRYING TO FIND PLAYER STATUS BY ID");
			throw error;
		}
	}

	public async removeByGameId(
		gameId: number,
	): Promise<void> {
		try {
			await this.waitingQueueRepository
			.createQueryBuilder()
			.delete()
			.where("game_id = :gameId", { gameId })
			.execute();

		} catch (error) {
			throw error;
		}
	}
}
