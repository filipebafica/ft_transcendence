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
        let entity = await this.roomBannedUserRepository.findOne({
            where: {
                banned_user: { id: userId } as User,
                room: { id: roomId } as Room
            },
        });

        await this.roomBannedUserRepository.delete(entity);
    }
}
