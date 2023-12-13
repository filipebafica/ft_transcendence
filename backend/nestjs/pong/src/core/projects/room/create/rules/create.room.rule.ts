import CreateGateway from "../gateways/create.gateway";
import RoomDTO from "../../shared/dtos/room.dto";

export default class CreateRule {
    constructor(
        private readonly createGateway: CreateGateway
    ) {
    }

    async apply(
        roomName: string,
        isPublic: boolean
    ): Promise<RoomDTO> {
        return await this.createGateway.create(
            roomName,
            isPublic
        );
    }
}