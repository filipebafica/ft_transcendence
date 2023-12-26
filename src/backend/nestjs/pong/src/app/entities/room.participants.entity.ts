import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Room } from "./room.entity";
import { User } from "./user.entity";

@Entity()
export class RoomParticipants {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true, name: 'is_owner' })
    is_owner: boolean;

    @Column({ nullable: true, name: 'is_admin'})
    is_admin: boolean;

    @ManyToOne(() => Room, room => room.id)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_id' })
    user: User;
}