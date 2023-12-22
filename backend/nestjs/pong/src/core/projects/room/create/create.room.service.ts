import { Logger } from '@nestjs/common';
import CreateRule from './rules/create.room.rule';
import CreateGateway from './gateways/create.gateway';
import { RequestDTO } from './dtos/request.dto';
import { ResponseDTO } from './dtos/response.dto';
import HashRule from './rules/hash.rule';

export class CreateService {
    private createRule: CreateRule;
    private hashRule: HashRule;

    constructor(
        private readonly logger: Logger,
        createGateway: CreateGateway
    ) {
        this.createRule = new CreateRule(createGateway);
        this.hashRule = new HashRule();
    }

    async execute(requestDTO: RequestDTO): Promise<ResponseDTO> {
        try {
            this.logger.log(JSON.stringify({"Service has started": {"request": requestDTO}}));

            const password = this.hashRule.apply(requestDTO.password);

            const room = await this.createRule.apply(
                requestDTO.roomName,
                requestDTO.isPublic,
                password
            );
            const responseDTO = new ResponseDTO(room);

            this.logger.log(JSON.stringify({"Service has finished": {"response": responseDTO}}));
            return responseDTO;
        } catch (error) {
            this.logger.error(JSON.stringify({"Service has faield": error.message}));
            throw error;
        }
    }
}
