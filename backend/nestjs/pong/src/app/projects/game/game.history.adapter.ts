import { GameHistory } from "src/app/entities/game.history.entity";
import { GameHistoryDTO } from "src/core/projects/game/shared/dtos/game.history.dto";
import { GameStatus } from "src/core/projects/game/shared/enums/game.status";
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
	  
		  const adjustedIndex = Math.max(index, 1);
	  
		  const startIndex = (adjustedIndex - 1) * recordsPerPage;
		  const endIndex = startIndex + recordsPerPage;
		  const games = await this.gameHistoryRepository.find({
			where: [
			  { player_one_id: userId, status: GameStatus.Finished },
			  { player_two_id: userId, status: GameStatus.Finished },
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
		winnerId: number | null,
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
			gameHistory.winner_id = winnerId;

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
		status: number,
		winnerId: number,
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
			gameHistory.winner_id = winnerId;

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
		  game.winner_id,
		  game.disconnected_id,
		);
	}

	public async removeUncompleteGameHistory(
		gameId: number,
	): Promise<void> {
		try {
			await this.gameHistoryRepository
			.createQueryBuilder()
			.delete()
			.where("id = :gameId", { gameId })
			.execute();
		} catch (error) {
			throw error;
		}
	}

	public async getWinnerByGameId(
		gameId: number,
	): Promise<number | null> {
		try {
			const result = await this.gameHistoryRepository
			.findOne({
				select: ["winner_id"],
				where: { id: gameId, status: 2},
			});

			
			if (result == undefined) {
				return null;
			}

			return result.winner_id;
		} catch (error) {
			throw error;
		}
	}

	public async createPrivateGame(
		status: number,
		player1Score: number,
		player2Score: number,
		player1Id: number,
		player2Id: number,
	): Promise<number> {
		try {
			let entity = await this.gameHistoryRepository.create({
				status: status,
				player_one_id: player1Id,
				player_two_id: player2Id,
				player_one_score: player1Score,
				player_two_score: player2Score,
			})

			entity = await this.gameHistoryRepository.save(entity);
			return entity.id;
		} catch (error) {
			throw error;
		}
	}

	public async getRunningGameByPlayerId(
		playerId: number,
	): Promise<number | null> {
		try {
			const result = await this.gameHistoryRepository.findOne({
				where: [
					{ player_one_id: playerId },
					{ player_two_id: playerId },
					{ status: GameStatus.Running},
				],
			});

			if (result == undefined) {
				return null;
			}

			return result.id;
		} catch (error) {
			throw error;
		}
	}

	public async listAndCountMatchesByUserId(userId: number, index: number): Promise<{games: GameHistoryDTO[], pages: number}> {
		try {
		  const recordsPerPage = 10;
	  
		  const adjustedIndex = Math.max(index, 1);
	  
		  const startIndex = (adjustedIndex - 1) * recordsPerPage;
		  const endIndex = startIndex + recordsPerPage;
		  const [games, gamesCount] = await this.gameHistoryRepository.findAndCount({
			where: [
			  { player_one_id: userId, status: GameStatus.Finished },
			  { player_two_id: userId, status: GameStatus.Finished },
			],
			order: { id: 'ASC' }, // Assuming id is the primary key and represents the order
			skip: Math.max(startIndex, 0), // Ensure skip is not negative
			take: endIndex - Math.max(startIndex, 0), // Limit the number of records retrieved
		  });

		  const gameHistoryDTOs = games.map((game) => this.convertToDTO(game));

		  const pages: number = Math.ceil(gamesCount / recordsPerPage);

		  return {games: gameHistoryDTOs, pages: pages};
		} catch (error) {
		  console.error(error.message);
		  throw error;
		}
	}

	public async updateWaitingGameStatus(gameId: number, gameStatus: GameStatus): Promise<void> {
		try {
			const gameHistory = await this.gameHistoryRepository.findOne({
				where: {
					id: gameId,
					status: GameStatus.Waiting,
				},
				lock: {
					mode: "pessimistic_write",
				}
			});

			if (gameHistory == null) {
				throw Error("There is no game to update with max score");
			}

			gameHistory.status = gameStatus;

			await this.gameHistoryRepository.save(gameHistory);
		} catch (error) {
			throw error;
		}
	}
}
