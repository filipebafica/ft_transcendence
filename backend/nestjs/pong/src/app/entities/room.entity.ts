import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { RoomParticipants } from "./room.participants.entity";

@Entity()
export class Room {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    is_public: boolean;

    @OneToMany(() => RoomParticipants, participants => participants.room)
    participants: RoomParticipants[];
}