import CreateGateway from "../gateways/room.gateway";

export default class CreateRule {
    constructor(
        private readonly createGateway: CreateGateway
    ) {
    }

    apply(
        userId: number,
        roomName: string,
        type: string
    ): void {
        this.createGateway.create(
            userId,
            roomName,
            type
        );
    }
}