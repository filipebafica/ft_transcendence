import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomParticipants } from "./room.participants.entity";
import { RoomBannedUser } from "./room.banned.user.entity";
import { RoomMutedUser } from "./room.muted.user.entity.";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    isPublic: boolean;

    @OneToMany(() => RoomParticipants, participants => participants.room)
    participants: RoomParticipants[];

    @OneToMany(() => RoomBannedUser, bannedUserRoom => bannedUserRoom.room)
    banned_users: RoomBannedUser[];

    @OneToMany(() => RoomMutedUser, mutedUserRoom => mutedUserRoom.room)
    muted_users: RoomMutedUser[];
}