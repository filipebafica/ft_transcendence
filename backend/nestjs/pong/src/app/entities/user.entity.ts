import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { RoomParticipants } from "./room.participants.entity";
import { UserChat } from "./user.chat.entity";
import { UserStatus } from "./user.status.entity";

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
    blockeed_user_chat: UserChat[];

    @OneToOne(() => UserStatus, userStatus => userStatus.user)
    user_status: UserStatus;
}