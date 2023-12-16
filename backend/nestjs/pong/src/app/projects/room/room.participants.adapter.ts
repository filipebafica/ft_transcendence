import { Injectable } from "@nestjs/common";
import RoomParticipantsGateway from "src/core/projects/room/shared/gateways/room.participants.gateways";
import { EntityManager, Repository } from "typeorm";
import { RoomParticipants } from "src/app/entities/room.participants.entity";
import RoomPartitipantsDTO from "src/core/projects/room/join/dtos/room.participants.dto";
import { plainToInstance } from "class-transformer";

@Injectable()
export default class RoomParticipantsAdapter implements RoomParticipantsGateway {
    private roomParticipantsRepository: Repository<RoomParticipants>;
    
    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.roomParticipantsRepository = entityManager.getRepository(RoomParticipants);
    }
    async join(
        userId: number,
        roomId: number,
        isOwner: boolean,
        isAdmin: boolean
    ): Promise<RoomPartitipantsDTO> {
        let entity = this.roomParticipantsRepository.create({
            isOwner: isOwner,
            isAdmin: isAdmin,
            room: roomId,
            user: userId
        });

        entity = await this.roomParticipantsRepository.save(entity);
        return plainToInstance(RoomPartitipantsDTO, entity);
    }
}
