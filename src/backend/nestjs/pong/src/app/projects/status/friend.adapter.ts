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
        friedUserId?: number,
        friendNickName?: string
    ): Promise<void> {
        return ;
    }

    async getByUserId(
        userId: number
    ): Promise<FriendDTO[]> {
        const entity: Friend[] = await this.friendRepository
        .createQueryBuilder('friend')
        .innerJoinAndSelect('friend.user', 'user')
        .innerJoinAndSelect('friend.friendship', 'friendRelation')
        .leftJoinAndSelect('friendRelation.user_status', 'user_status')
        .leftJoinAndSelect('friendRelation.blocked_user_chat', 'blockedUserRelation')
        .leftJoinAndSelect('blockedUserRelation.user', 'blocked_User')
        .where('user.id = :userId', {userId})
        .getMany();

        let friendDTOs = new Array<FriendDTO>;

        entity.map(
            (row) => friendDTOs.push(new FriendDTO(
                row.friendship.id,
                row.friendship.nick_name,
            ))
        );

        return friendDTOs;
    }

    delete(
        userId: number,
        friedUserId: number
    ): Promise<void> {
        return ;
    }
}