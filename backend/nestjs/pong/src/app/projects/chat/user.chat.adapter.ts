import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from 'typeorm';
import { UserChat } from "src/app/entities/user.chat.entity";
import { plainToInstance } from "class-transformer";
import UserChatGateway from "src/core/projects/chat/shared/user.chat.gateway";
import { User } from "src/app/entities/user.entity";


// UserChat table has id, userId and blockedUsers
@Injectable()
export default class UserChatAdapter implements UserChatGateway {
    private userChatRepository: Repository<UserChat>;

    constructor(
        private readonly entityManager: EntityManager,
    ) {
        this.userChatRepository = entityManager.getRepository(UserChat);
    }

    async create(blockerUserId: number, targetUserId: number) {
        let entity = this.userChatRepository.create({
            user: { id: blockerUserId } as User,
            blockedUser: { id: targetUserId } as User
        });

        return await this.userChatRepository.save(entity);
    }

    async get(userId: number): Promise<Array<number>>{
        const entity: UserChat[] = await this.userChatRepository
        .createQueryBuilder('userChat')
        .innerJoinAndSelect('userChat.user', 'user')
        .innerJoinAndSelect('userChat.blockedUser', 'blockedUser')
        .where('user.id = :userId', {userId})
        .getMany();

        return entity.map((row) => row.blockedUser.id);
    }
}