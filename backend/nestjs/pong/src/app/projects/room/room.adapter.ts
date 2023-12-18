import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Room } from "src/app/entities/room.entity";
import CreateGateway from "src/core/projects/room/create/gateways/create.gateway";
import RoomByParticipantDTO from "src/core/projects/room/listByUserId/dtos/room.by.participant.dto";
import RoomDTO from "src/core/projects/room/shared/dtos/room.dto";
import RoomParticipantDTO from "src/core/projects/room/shared/dtos/room.participant.dto";
import UserDTO from "src/core/projects/room/shared/dtos/user.dto";
import RoomGateway from "src/core/projects/room/shared/gateways/room.gateway";
import { EntityManager, QueryFailedError, Repository } from "typeorm";


// Room tabele has id, name, ownerId, adminId, type, participants,
@Injectable()
export default class RoomAdapter implements CreateGateway, RoomGateway {
    private roomRepository: Repository<Room>;

    constructor(
        private readonly entityManager: EntityManager,
    ) {
        this.roomRepository = entityManager.getRepository(Room);
    }

    async create(
        roomName: string,
        isPublic: boolean
    ): Promise<RoomDTO> {
        try {
            let entity = this.roomRepository.create({
                name: roomName,
                isPublic: isPublic
            });

            entity = await this.roomRepository.save(entity);
            return plainToInstance(RoomDTO, entity);
        } catch (error) {
            if (error instanceof QueryFailedError) {
                // Check the database error code or message to determine the cause
                if (error.message.includes('duplicate key value violates unique constraint')) {
                  throw new Error("There is already a room named " + roomName);
                }
            }
        }
    }

    async get(): Promise<RoomDTO[]> {
        const entity = await this.roomRepository
        .createQueryBuilder('room')
        .leftJoinAndSelect('room.participants', 'participants')
        .leftJoinAndSelect('participants.user', 'user')
        .getMany();

        return entity.map((room) => new RoomDTO(
            room.id,
            room.name,
            room.isPublic,
            room.participants.map((participant) => new RoomParticipantDTO(
                participant.is_owner,
                participant.is_admin,
                new UserDTO(
                    participant.user.id,
                    participant.user.name,
                    participant.user.nick_name,
                )
            ))
        ))
    }

    async getByRomId(roomId: number): Promise<RoomDTO> {
        const entity = await this.roomRepository
        .createQueryBuilder('room')
        .innerJoinAndSelect('room.participants', 'participants')
        .leftJoinAndSelect('participants.user', 'user')
        .where('room.id = :roomId', { roomId })
        .getOne();

        return new RoomDTO(
            entity.id,
            entity.name,
            entity.isPublic,
            entity.participants.map((participant) => new RoomParticipantDTO(
                participant.is_owner,
                participant.is_admin,
                new UserDTO(
                    participant.user.id,
                    participant.user.name,
                    participant.user.nick_name,
                )
            ))
        )
    }

    async getByUserId(userId: number): Promise<RoomByParticipantDTO[]> {
        const entity = await this.roomRepository
        .createQueryBuilder('room')
        .innerJoinAndSelect('room.participants', 'participants')
        .where('participants.user = :userId', { userId })
        .select([
            'room.id AS id',
            'room.name AS name',
            'participants.is_owner AS is_owner',
            'participants.is_admin AS is_admin'
        ])
        .getRawMany();

        return entity.map((row) => new RoomByParticipantDTO(
            row.id,
            row.name,
            row.is_owner,
            row.is_admin,
        ))
    }
}