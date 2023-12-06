import RoomGateway from "../gateways/room.gateway";

export default class CreateRoomRule {
    constructor(
        private readonly roomGateway: RoomGateway
    ) {
    }

    apply(
        userId: number,
        roomName: string,
        type: string
    ): void {
        this.roomGateway.create(
            userId,
            roomName,
            type
        );
    }
}