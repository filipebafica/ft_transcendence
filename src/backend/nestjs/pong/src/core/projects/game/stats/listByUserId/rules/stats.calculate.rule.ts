import { GameHistoryDTO } from "../../../shared/dtos/game.history.dto";
import { StatsDTO } from "../dtos/stats.dto";

export default class StatsCalculateRule {
    apply(
        userId: number,
        gameHistoryDTO: GameHistoryDTO[]
    ): StatsDTO {

        let wins = gameHistoryDTO.reduce(
            (count, game) => count + (
                    game.winnerId === userId ? 1 : 0
                ), 0
        )
        let loses = gameHistoryDTO.length - wins;
        let winRate = Math.round(wins / gameHistoryDTO.length * 100);

        return new StatsDTO(wins, loses, winRate);
    }
}