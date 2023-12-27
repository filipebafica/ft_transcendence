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
        muteTimeoutAt: Date
    ): Promise<void> {
        let entity = await this.roomMutedUserRepository.findOne({
            where: {
                 muted_user: { id: userId } as User,
                 room: { id: roomId } as Room,
            }
        })

        if (entity) {
            await this.roomMutedUserRepository
            .createQueryBuilder()
            .update()
            .set({ mute_timeout_at: muteTimeoutAt })
            .where('muted_user_id = :userId AND room_id = :roomId', { userId: userId, roomId: roomId })
            .execute();

            return ;
        }

        let newEntity = this.roomMutedUserRepository.create({
                muted_user: { id: userId } as User,
                room: { id: roomId } as Room,
                mute_timeout_at: muteTimeoutAt
        });

        await this.roomMutedUserRepository.save(newEntity);
    }

    async unmute(
        userId: number,
        roomId: number
    ): Promise<void> {
        await this.roomMutedUserRepository
            .createQueryBuilder()
            .delete()
            .where('room_id = :roomId AND muted_user_id = :userId', { roomId: roomId, userId: userId })
            .execute();
    }
}
