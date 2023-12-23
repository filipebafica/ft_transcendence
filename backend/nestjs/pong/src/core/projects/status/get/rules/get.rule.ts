import StatusGateway from "../../shared/gateways/status.gateway";

export default class GetRule {
    constructor(
        private readonly statusGateway: StatusGateway
    ) {
    }

    async apply(
        userId: number
    ) {
        return await this.statusGateway.get(
            userId
        );
    }
}