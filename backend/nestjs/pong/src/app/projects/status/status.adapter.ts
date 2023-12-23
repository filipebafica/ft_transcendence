import { Injectable } from "@nestjs/common";
import { User } from "src/app/entities/user.entity";
import { UserStatus } from "src/app/entities/user.status.entity";
import StatusDTO from "src/core/projects/status/shared/dtos/status.dto";
import StatusGateway from "src/core/projects/status/shared/gateways/status.gateway";
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
    ): Promise<void> {
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

    async get(userId: number): Promise<StatusDTO> {
        const entity = await this.statusRepository.findOne({
            where: { user: { id: userId } as User },
        })

        return new StatusDTO(
            entity?.status ?? 'off-line'
        );
    }
}