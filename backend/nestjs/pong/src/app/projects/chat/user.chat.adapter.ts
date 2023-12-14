import { Injectable } from "@nestjs/common";
import { EntityManager, Repository } from 'typeorm';
import { UserChat } from "src/app/entities/user.chat.entity";
import UserChatDTO from "src/core/projects/chat/sendMessageAuthorization/dtos/user.chat.dto";
import UserChatGateway from "src/core/projects/chat/sendMessageAuthorization/gateways/user.chat.gateway";
import { plainToInstance } from "class-transformer";


// UserChat table has id, userId and blockedUsers
@Injectable()
export default class UserChatAdapter implements UserChatGateway {
    private userChatRepository: Repository<UserChat>;

    constructor(
        private readonly entityManager: EntityManager,
    ) {
        this.userChatRepository = entityManager.getRepository(UserChat);
    }

    async getUserChat(userId: number): Promise<Array<number>>{
        const entity: UserChat[] = await this.userChatRepository
        .createQueryBuilder('userChat')
        .innerJoinAndSelect('userChat.user', 'user')
        .innerJoinAndSelect('userChat.blockedUser', 'blockedUser')
        .where('user.id = :userId', {userId})
        .getMany();

        return entity.map((row) => row.blockedUser.id);
    }
}