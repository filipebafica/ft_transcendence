import { ClientManager } from "src/app/entities/client.manager.entity";
import { ClientManagerInterface } from "src/core/projects/game/shared/interfaces/client.manager.interface";
import { EntityManager, Repository } from "typeorm";

export class ClientManagerAdapter implements ClientManagerInterface {
	private  clientManagerRepository: Repository<ClientManager>;

	constructor(
		private readonly entityManager: EntityManager,
	) {
		this.clientManagerRepository = entityManager.getRepository(ClientManager);
	}

	public async addClientGameMask(
		clientId: string,
		playerId: number,
		gameId: number
	): Promise<void> {
		try {
			let entity: ClientManager = this.clientManagerRepository.create({
				client_id: clientId,
				player_id: playerId,
				game_id: gameId,
			});

			entity = await this.clientManagerRepository.save(entity);
		} catch (error) {
			throw error;
		}
	}

	public async removeClientGameMask(
		gameId: number,
	): Promise<void>{
		try {
			await this.clientManagerRepository
			.createQueryBuilder()
			.delete()
			.from(ClientManager)
			.where("game_id = :gameId", { gameId })
			.execute();

		} catch (error) {
			throw error;
		}
	}

	public async getClientGameIdMask(
		clientId: string,
	): Promise<number>{
		try {
			const result = await this.clientManagerRepository.findOne({
				select: ["game_id"],
				where: { client_id: clientId},
			  });

			if (result == undefined) {
				throw new Error("Couldn't get client gameid mask");
			}

			return result.game_id;
		} catch (error) {
			throw error;
		}
	}

	public async getClientPlayerIdMask(
		clientId: string
	): Promise<number>{
		try {
			const result = await this.clientManagerRepository.findOne({
				select: ["player_id"],
				where: { client_id: clientId},
			  });

			if (result == undefined) {
				throw new Error("Couldn't get client playerid mask");
			}
			return result.player_id;
		} catch (error) {
			throw error;
		}
	}

	public async hasMask(
		clientId: string,
	): Promise<boolean>{
		try {
			const result: ClientManager = await this.clientManagerRepository.findOne({
				where: {client_id: clientId},
			});

			if (result == undefined) {
				return false;
			}

			return true;
		} catch (error) {
			throw error;
		}
	}
}
