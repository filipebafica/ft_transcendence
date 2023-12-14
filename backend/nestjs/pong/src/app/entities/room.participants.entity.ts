import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from "./user.entity";

@Entity()
export class RoomParticipants {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, name: 'is_owner' })
    isOwner: boolean;

    @Column({ nullable: true, name: 'is_admin'})
    isAdmin: boolean;

    @ManyToOne(() => Room, room => room.id)
    @JoinColumn({ name: 'room_id' })
    room: number;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: number;
}