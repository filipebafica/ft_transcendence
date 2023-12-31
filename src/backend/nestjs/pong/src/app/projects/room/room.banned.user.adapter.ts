import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from "typeorm";
import { User } from "src/app/entities/user.entity";
import { Room } from "src/app/entities/room.entity";
import RoomBannedUserGateway from "src/core/projects/room/shared/gateways/room.user.banned.gateway";
import { RoomBannedUser } from "src/app/entities/room.banned.user.entity";

@Injectable()
export default class RoomBannedUserAdapter implements RoomBannedUserGateway {
    private roomBannedUserRepository: Repository<RoomBannedUser>;
    
    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.roomBannedUserRepository = entityManager.getRepository(RoomBannedUser);
    }

    async ban(
        userId: number,
        roomId: number
    ): Promise<void> {
        let entity = this.roomBannedUserRepository.create({
                banned_user: { id: userId } as User,
                room: { id: roomId } as Room
        });

        await this.roomBannedUserRepository.save(entity);
    }

    async unban(
        userId: number,
        roomId: number
    ): Promise<void> {
        await this.roomBannedUserRepository
            .createQueryBuilder()
            .delete()
            .where('room_id = :roomId AND banned_user_id = :userId', { roomId: roomId, userId: userId })
            .execute();
    }

    async isUserBanned(
        userId: number,
        roomId: number
    ): Promise<boolean> {
        const bannedUser = await this.roomBannedUserRepository.findOne({
            where: {
                room: {id: roomId},
                banned_user: {id: userId}
            }
        })

        if (bannedUser == undefined) {
            return false;
        }

        return true;
    }
}
