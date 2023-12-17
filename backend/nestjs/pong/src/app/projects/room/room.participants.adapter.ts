import { Injectable } from "@nestjs/common";
import RoomParticipantsGateway from "src/core/projects/room/shared/gateways/room.participants.gateways";
import { EntityManager, Repository } from "typeorm";
import { RoomParticipants } from "src/app/entities/room.participants.entity";
import RoomPartitipantsDTO from "src/core/projects/room/join/dtos/room.participants.dto";
import { plainToInstance } from "class-transformer";
import { User } from "src/app/entities/user.entity";
import { Room } from "src/app/entities/room.entity";

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
            is_owner: isOwner,
            is_admin: isAdmin,
            room: { id: roomId } as Room,
            user: { id: userId } as User
        });

        entity = await this.roomParticipantsRepository.save(entity);
        return plainToInstance(RoomPartitipantsDTO, entity);
    }
}
