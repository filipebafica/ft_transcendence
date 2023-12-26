import { Logger } from '@nestjs/common';
import GetRule from './rules/get.rule';
import { RequestDTO } from './dtos/request.dto';
import StatusGateway from '../shared/gateways/status.gateway';
import { ResponseDTO } from './dtos/response.dto';

export class GetStatusService {
    private getRule: GetRule;

    constructor(
        private readonly logger: Logger,
        statusGateway: StatusGateway
    ) {
        this.getRule = new GetRule(statusGateway);
    }

    async execute(requestDTO: RequestDTO): Promise<ResponseDTO> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const statusDTO = await this.getRule.apply(requestDTO.userId);
            const responseDTO = new ResponseDTO(statusDTO);

            this.logger.log(JSON.stringify({"Service has finished": {"response": responseDTO}}));
            return responseDTO;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}))
            throw error;
        }
    }
}
