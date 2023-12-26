import CreateGateway from "../gateways/create.gateway";
import RoomDTO from "../../shared/dtos/room.dto";
import * as bcrypt from 'bcrypt';

export default class CreateRule {
    constructor(
        private readonly createGateway: CreateGateway
    ) {
    }

    async apply(
        roomName: string,
        isPublic: boolean,
        password?: string
    ): Promise<RoomDTO> {
        return await this.createGateway.create(
            roomName,
            isPublic,
            password
        );
    }
}