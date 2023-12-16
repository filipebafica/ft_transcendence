import { Injectable } from "@nestjs/common";
import { Friend } from "src/app/entities/friend.entity";
import FriendDTO from "src/core/projects/friend/listByUserId/dtos/friend.dto";
import FriendGateway from "src/core/projects/friend/shared/gateways/friend.gateway";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export default class FriendAdapter implements FriendGateway {
    private friendRepository: Repository<Friend>;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.friendRepository = entityManager.getRepository(Friend);
    }

    create(
        userId: number,
        friedUserId: number
    ) {
    }

    async getByUserId(
        userId: number
    ): Promise<FriendDTO[]> {
        const entity: Friend[] = await this.friendRepository
        .createQueryBuilder('friend')
        .innerJoinAndSelect('friend.user', 'user')
        .innerJoinAndSelect('friend.friendship', 'friendship')
        .where('user.id = :userId', {userId})
        .getMany();

        return entity.map((row) => row.friendship);
    }

    delete(
        userId: number,
        friedUserId: number
    ) {
    }
}