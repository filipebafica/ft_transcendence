import StatusGateway from "../gateways/status.gateway";

export default class CreateRule {
    constructor(
        private readonly statusGateway: StatusGateway
    ) {
    }

    async apply(
        userId: number,
        newStatus: string,
    ) {
        return await this.statusGateway.create(
            userId,
            newStatus
        );
    }
}