import { GameHistoryDTO } from "../../../shared/dtos/game.history.dto";
import { GameHistoryRepository } from "../../../shared/interfaces/game.history.repository";

export default class GetGameHistoryRule {
    constructor(
        private readonly gameHistoryRespository: GameHistoryRepository
    ) {
    }

    async apply(userId: number): Promise<GameHistoryDTO[]> {
        let gameHistoryDTOs = new Array<GameHistoryDTO>;

        let i = 1;
        let isThreRows = true;
        while (isThreRows) {
            let rows = await this.gameHistoryRespository.listMatchesByUserId(userId, i);
            gameHistoryDTOs.push(...rows);
            isThreRows = (rows.length > 0);
            ++i;
        }

        return gameHistoryDTOs;
    }
}