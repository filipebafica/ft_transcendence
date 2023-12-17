import { Logger } from '@nestjs/common';
import { ResponseDTO } from './dtos/response.dto';
import GetGameHistoryRule from './rules/get.game.history.rule';
import { RequestDTO } from './dtos/request.dto';
import { GameHistoryRepository } from '../../shared/interfaces/game.history.repository';
import StatsCalculateRule from './rules/stats.calculate.rule';

export class ListStatsByUserIdService {
    private getGameHistoryRule: GetGameHistoryRule;
    private statsCalculateRule: StatsCalculateRule;

    constructor(
        private readonly logger: Logger,
        gameHistoryRespository: GameHistoryRepository
    ) {
        this.getGameHistoryRule = new GetGameHistoryRule(gameHistoryRespository);
        this.statsCalculateRule = new StatsCalculateRule();
    }

   async execute(requestDTO: RequestDTO): Promise<ResponseDTO>
    {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const gameHistory = await this.getGameHistoryRule.apply(requestDTO.userId);
            const stats = this.statsCalculateRule.apply(requestDTO.userId, gameHistory);
            const responseDTO = new ResponseDTO(stats);

            this.logger.log(JSON.stringify({"Service has finished": {"response": responseDTO}}));
            return responseDTO;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
