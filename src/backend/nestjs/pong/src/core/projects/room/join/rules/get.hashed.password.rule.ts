import RoomGateway from "../../shared/gateways/room.gateway";

export default class GetHashedPasswordRule {
    constructor(
        private roomGateway: RoomGateway
    ) {
    }

    async apply(roomId: number): Promise<string> {
        return await this.roomGateway.getHashedPassword(roomId);
    }
}