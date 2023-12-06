import JoinGateway from "../gateways/join.gateways";

export default class JoinRule {
    constructor(
        private readonly joinGateway: JoinGateway
    ) {
    }

    apply(userId: number, roomId: number): void {
        this.joinGateway.join(userId, roomId);
    }
}