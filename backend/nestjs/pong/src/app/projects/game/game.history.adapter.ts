import { error } from "console";
import { GameHistory } from "src/app/entities/game.history.entity";
import { GameHistoryDTO } from "src/core/projects/game/shared/dtos/game.history.dto";
import { GameHistoryRepository as GameHistoryRepository } from "src/core/projects/game/shared/interfaces/game.history.repository";
import { EntityManager, Repository } from "typeorm";

export class GameHistoryAdapter implements GameHistoryRepository {
	private gameHistoryRepository: Repository<GameHistory>;

	constructor(
		private readonly entityManager: EntityManager,
	) {
		this.gameHistoryRepository = entityManager.getRepository(GameHistory);
	}

	public async getByGameId(gameId: number): Promise<GameHistoryDTO> {
		try {
			const gameHistory = await this.gameHistoryRepository.findOne({
				where: {id: gameId}
			});

			if (gameHistory == undefined) {
				throw new Error("There is no history for the gameId");
			}

			return this.convertToDTO(gameHistory);
		} catch (error) {
			console.log("[GameHistoryAdapter] ERROR WHEN TRYING TO GET GAME BY ID");
			throw error;
		}
	}

	//no máximo 10 jogos
	public async listMatchesByUserId(userId: number, index: number): Promise<GameHistoryDTO[]> {
		try {
		  const recordsPerPage = 10;
	  
		  // Ensure index is at least 1
		  const adjustedIndex = Math.max(index, 1);
	  
		  const startIndex = (adjustedIndex - 1) * recordsPerPage;
		  const endIndex = startIndex + recordsPerPage;
	  
		  const games = await this.gameHistoryRepository.find({
			where: [
			  { player_one_id: userId },
			  { player_two_id: userId },
			],
			order: { id: 'ASC' }, // Assuming id is the primary key and represents the order
			skip: Math.max(startIndex, 0), // Ensure skip is not negative
			take: endIndex - Math.max(startIndex, 0), // Limit the number of records retrieved
		  });
	  
		  const gameHistoryDTOs = games.map((game) => this.convertToDTO(game));
	  
		  return gameHistoryDTOs;
		} catch (error) {
		  console.error(error.message);
		  throw error;
		}
	  }

	public async createGame(
		status: number,
		player1Score: number,
		player2Score: number,
		player1Id: number,
		player2Id: number
	): Promise<number> {
		try {
			let entity: GameHistory = await this.gameHistoryRepository.create({
				status: status,
				player_one_id: player1Id,
				player_two_id: player2Id,
				player_one_score: player1Score,
				player_two_score: player2Score,
			});

			entity = await this.gameHistoryRepository.save(entity);
			console.log(`ENTITY ID: ${entity.id}`);
			return entity.id;
		} catch (error) {
			console.log("[GameHistoryAdapter] ERROR WHEN TRYING TO CREATE GAME");
			throw error;
		}
	}

	public async updateGameHistoryWithDisconnect(
		gameId: number,
		player1Score: number,
		player2Score: number,
		status: number,
		disconnectedId: number,
	): Promise<number> {
		try {
			const gameHistory = await this.gameHistoryRepository.findOne({
				where: {
					id: gameId
				}
			});

			if (gameHistory == null) {
				throw Error("There is no game to update disconnection");
			}

			gameHistory.player_one_score = player1Score;
			gameHistory.player_two_score = player2Score;
			gameHistory.status = status;
			gameHistory.disconnected_id = disconnectedId;

			const result = await this.gameHistoryRepository.save(gameHistory);

			return result.id;
		} catch (error) {
			console.log("[GameHistoryAdapter] ERROR WHEN TRYING TO UPDATE GAME");
			throw error;
		}
	}

	public async updateGameHistoryWithSecondPlayer(
		gameId: number,
		status: number,
		player2Id: number,
	): Promise<void> {
		try {
			const gameHistory = await this.gameHistoryRepository.findOne({
				where: {
					id: gameId
				}
			});

			if (gameHistory == null) {
				throw Error("There is no game to add second player");
			}

			gameHistory.status = status;
			gameHistory.player_two_id = player2Id;

			await this.gameHistoryRepository.save(gameHistory);
		} catch (error) {
			throw error;
		}
	}

	public async updateGameHistoryWithMaxScore(
		gameId: number, 
		player1Score: number, 
		player2Score: number, 
		status: number
	): Promise<number> {
		try {
			const gameHistory = await this.gameHistoryRepository.findOne({
				where: {
					id: gameId
				}
			});

			if (gameHistory == null) {
				throw Error("There is no game to update with max score");
			}

			gameHistory.player_one_score = player1Score;
			gameHistory.player_two_score = player2Score;
			gameHistory.status = status;

			const result = await this.gameHistoryRepository.save(gameHistory);

			return result.id;
		} catch (error) {
			console.log("[GameHistoryAdapter] ERROR WHEN TRYING TO UPDATE GAME");
			throw error;
		}
	}

	private convertToDTO(game: GameHistory): GameHistoryDTO {
		return new GameHistoryDTO(
		  game.id,
		  game.status,
		  game.player_one_id,
		  game.player_two_id,
		  game.player_one_score,
		  game.player_two_score,
		  game.disconnected_id,
		);
	  }

}
