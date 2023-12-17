import { Injectable } from "@nestjs/common";
import { User } from "src/app/entities/user.entity";
import { UserStatus } from "src/app/entities/user.status.entity";
import StatusGateway from "src/core/projects/status/create/gateways/status.gateway";
import { EntityManager, Repository } from "typeorm";

@Injectable()
export default class StatusAdapter implements StatusGateway {
    private statusRepository: Repository<UserStatus>;

    constructor(
        private readonly entityManager: EntityManager
    ) {
        this.statusRepository = entityManager.getRepository(UserStatus);
    }

    async create(
        userId: number,
        newStatus: string
    ) {
        const entity = await this.statusRepository.findOne({
            where: { user: { id: userId } as User },
        })

        if (entity) {
            await this.statusRepository.update(entity.id, {status: newStatus});
            return ;
        }

        const newEntity = this.statusRepository.create({
            user: {id: userId } as User,
            status: newStatus
        })

        await this.statusRepository.save(newEntity);
    }
}