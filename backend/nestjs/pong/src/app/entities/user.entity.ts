import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomParticipants } from "./room.participants.entity";
import { UserChat } from "./user.chat.entity";
import { UserStatus } from "./user.status.entity";
import { RoomBannedUser } from "./room.banned.user.entity";
import { RoomMutedUser } from "./room.muted.user.entity.";
import { Friend } from "./friend.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    nick_name: string;

    @OneToMany(() => RoomParticipants, participants => participants.user)
    participants: RoomParticipants[];

    @OneToMany(() => UserChat, userChat => userChat.user)
    user_chat: UserChat[];

    @OneToMany(() => UserChat, userChat => userChat.blocked_user)
    blocked_user_chat: UserChat[];

    @OneToMany(() => RoomBannedUser, roomBannedUser => roomBannedUser.banned_user)
    banned_user_room: RoomBannedUser[];

    @OneToMany(() => RoomMutedUser, roomMutedUser => roomMutedUser.muted_user)
    muted_user_room: RoomMutedUser[];

    @OneToMany(() => Friend, friend => friend.user)
    friend: Friend[];

    @OneToOne(() => UserStatus, userStatus => userStatus.user)
    user_status: UserStatus;
}