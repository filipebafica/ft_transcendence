import { Injectable } from "@nestjs/common";
import { Friend } from "src/app/entities/friend.entity";
import { User } from "src/app/entities/user.entity";
import FriendDTO from "src/core/projects/friend/listByUserId/dtos/friend.dto";
import FriendGateway from "src/core/projects/friend/shared/gateways/friend.gateway";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export default class FriendAdapter implements FriendGateway {
    private friendRepository: Repository<Friend>;
    private userRepository: Repository<User>;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.friendRepository = entityManager.getRepository(Friend);
        this.userRepository = entityManager.getRepository(User);
    }

    async create(
        userId: number,
        friedUserId?: number,
        friendNickName?: string

    ) {
        if (friedUserId) {
            let user = this.friendRepository.create({
                user: { id: userId } as User,
                friendship: { id: friedUserId } as User
            });

            let friend = this.friendRepository.create({
                user: { id: friedUserId } as User,
                friendship: { id: userId } as User
            });

            await this.friendRepository.save(user);
            await this.friendRepository.save(friend);
            return ;
        }

        if (friendNickName) {
            let friedUserId = await this.userRepository.findOne({
                where: { nick_name: friendNickName },
            });

            let user = this.friendRepository.create({
                user: { id: userId } as User,
                friendship: { id: friedUserId.id } as User
            });

            let friend = this.friendRepository.create({
                user: { id: friedUserId.id } as User,
                friendship: { id: userId } as User
            });

            await this.friendRepository.save(user);
            await this.friendRepository.save(friend);
        }
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
                row.friendship.user_status.status,
                row.friendship.blocked_user_chat.find((blockedUser) => blockedUser.user.id === userId)? true : false,
            ))
        );

        return friendDTOs;
    }

    async delete(
        userId: number,
        friedUserId: number
    ) {
        let user = this.friendRepository.create({
            user: { id: userId } as User,
            friendship: { id: friedUserId } as User
        });

        let friend = this.friendRepository.create({
            user: { id: friedUserId } as User,
            friendship: { id: userId } as User
        });

        await this.friendRepository.delete(user);
        await this.friendRepository.delete(friend);
    }
}