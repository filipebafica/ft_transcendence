import { Injectable } from "@nestjs/common";
import RoomParticipantsGateway from "src/core/projects/room/shared/gateways/room.participants.gateways";
import { EntityManager, Repository } from "typeorm";
import { RoomParticipants } from "src/app/entities/room.participants.entity";
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
    ): Promise<void> {
        let entity = this.roomParticipantsRepository.create({
            is_owner: isOwner,
            is_admin: isAdmin,
            room: { id: roomId } as Room,
            user: { id: userId } as User
        });

        await this.roomParticipantsRepository.save(entity);
    }

    async remove(
        userId: number,
        roomId: number
    ): Promise<void> {
        await this.roomParticipantsRepository
        .createQueryBuilder()
        .delete()
        .where('room_id = :roomId', { roomId: roomId })
        .where('user_id = :userId', { userId: userId })
        .execute();
    }
}
