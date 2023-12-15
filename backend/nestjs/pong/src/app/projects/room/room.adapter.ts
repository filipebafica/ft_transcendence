import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Room } from "src/app/entities/room.entity";
import CreateGateway from "src/core/projects/room/create/gateways/create.gateway";
import RoomDTO from "src/core/projects/room/shared/dtos/room.dto";
import GetRoomsGateway from "src/core/projects/room/shared/gateways/get.rooms.gateway";
import { EntityManager, QueryFailedError, Repository } from "typeorm";


// Room tabele has id, name, ownerId, adminId, type, participants,
@Injectable()
export default class RoomAdapter implements CreateGateway, GetRoomsGateway {
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
        const rooms: Room[] = await this.roomRepository.find({ relations: ['participants', 'participants.user'] });
        return plainToInstance(RoomDTO, rooms);
    }

    async getByUserId(userId: number): Promise<RoomDTO[]> {
        const entity = await this.roomRepository
        .createQueryBuilder('room')
        .innerJoin('room.participants', 'participants')
        .where('participants.user = :userId', { userId })
        .select([
            'room.id',
            'room.name',
            'participants.id',
            'participants.isOwner',
            'participants.isAdmin'
        ])
        .getMany();

        return plainToInstance(RoomDTO, entity);
    }
}