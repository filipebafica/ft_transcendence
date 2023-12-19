import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { User } from "src/app/entities/user.entity";
import { Room } from "src/app/entities/room.entity";
import RoomMutedUserGateway from "src/core/projects/room/shared/gateways/room.user.muted.gateway";
import { RoomMutedUser } from "src/app/entities/room.muted.user.entity.";

@Injectable()
export default class RoomMutedUserAdapter implements RoomMutedUserGateway {
    private roomMutedUserRepository: Repository<RoomMutedUser>;
    
    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.roomMutedUserRepository = entityManager.getRepository(RoomMutedUser);
    }

    async mute(
        userId: number,
        roomId: number,
        muteTime: number
    ): Promise<void> {
        let entity = this.roomMutedUserRepository.create({
                muted_user: { id: userId } as User,
                room: { id: roomId } as Room,
                mute_time: muteTime
        });

        await this.roomMutedUserRepository.save(entity);
    }

    async unmute(
        userId: number,
        roomId: number
    ): Promise<void> {
        await this.roomMutedUserRepository
            .createQueryBuilder()
            .delete()
            .where('room_id = :roomId', { roomId: roomId })
            .where('muted_user_id = :userId', { userId: userId })
            .execute();
    }
}