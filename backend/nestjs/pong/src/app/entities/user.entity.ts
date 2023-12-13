import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomParticipants } from "./room.participants.entity";
import { UserChat } from "./user.chat.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => RoomParticipants, participants => participants.user)
    participants: RoomParticipants[];

    @OneToMany(() => UserChat, userChat => userChat.user)
    userChat: UserChat[];

    @OneToMany(() => UserChat, userChat => userChat.blockedUser)
    blockeedUserChat: UserChat[];
}