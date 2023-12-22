import { Injectable } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Room } from "src/app/entities/room.entity";
import { RoomMutedUser } from "src/app/entities/room.muted.user.entity.";
import CreateGateway from "src/core/projects/room/create/gateways/create.gateway";
import RoomByOneUserIdDTO from "src/core/projects/room/listOneByUserId/dtos/room.by.one.user.id.dto";
import RoomParticipantByOneUserIdDTO from "src/core/projects/room/listOneByUserId/dtos/room.participant.by.one.user.iddto";
import RoomByUserIdDTO from "src/core/projects/room/shared/dtos/room.by.user.id.dto";
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
        isPublic: boolean,
        password?: string
    ): Promise<RoomDTO> {
        try {

            let entity = this.roomRepository.create({
                name: roomName,
                is_public: isPublic,
                password: password
            });

            entity = await this.roomRepository.save(entity);
            return new RoomDTO(
                entity.id,
                entity.name,
                entity.is_public
            );

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
            room.is_public,
            room.password? true : false,
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
            entity.is_public,
            entity.password? true : false,
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

    async getAllByUserId(userId: number): Promise<RoomByUserIdDTO[]> {
        const entity = await this.roomRepository
        .createQueryBuilder('room')
        .innerJoinAndSelect('room.participants', 'participants')
        .where('participants.user = :userId', { userId })
        .select([
            'room.id AS id',
            'room.name AS name',
            'row.is_public AS is_public',
            'row.password AS password',
            'participants.is_owner AS is_owner',
            'participants.is_admin AS is_admin'
        ])
        .getRawMany();

        return entity.map((row) => new RoomByUserIdDTO(
            row.id,
            row.name,
            row.is_public,
            row.password? true : false,
            row.is_owner,
            row.is_admin,
        ))
    }

    async getOneByUserId(roomId: number, userId: number): Promise<RoomByOneUserIdDTO> {
        const entity = await this.roomRepository
        .createQueryBuilder('room')
        .innerJoinAndSelect('room.participants', 'participants')
        .leftJoinAndSelect('participants.user', 'user')
        .leftJoinAndSelect('user.friend', 'friendRelation')
        .leftJoinAndSelect('friendRelation.friendship', 'friends')
        .leftJoinAndSelect('user.muted_user_room', 'mutedRelation')
        .leftJoinAndSelect('mutedRelation.room', 'muted_rooms')
        .leftJoinAndSelect('user.user_status', 'status')
        .where('room.id = :roomId', { roomId })
        .getOne();

        return new RoomByOneUserIdDTO(
            entity.id,
            entity.name,
            entity.is_public,
            entity.password? true : false,
            entity.participants.map((participant) => new RoomParticipantByOneUserIdDTO(
                participant.is_owner,
                participant.is_admin,
                participant.user.friend.find((friend) => friend.friendship.id === userId)? true : false,
                this.isMuted(participant.user.muted_user_room.find((mutedRoom) => mutedRoom.room.id === roomId)),
                participant.user.user_status.status,
                new UserDTO(
                    participant.user.id,
                    participant.user.name,
                    participant.user.nick_name
                )
            ))
        )
    }

    async getHashedPassword(roomId: number): Promise<string> {
        let entity = await this.roomRepository.findOne({
            where: { id: roomId }
        })

        return entity.password;
    }

    async changePassword(roomId: number, newPassword?: string): Promise<void> {
        await this.roomRepository
        .createQueryBuilder()
        .update()
        .set({ password: newPassword })
        .where('id = :roomId', { roomId: roomId })
        .execute();
    }

    private isMuted(roomMutedUser?: RoomMutedUser): boolean {
        if (!roomMutedUser) {
            return false;
        }

        return roomMutedUser.mute_timeout_at > new Date();
    }
}