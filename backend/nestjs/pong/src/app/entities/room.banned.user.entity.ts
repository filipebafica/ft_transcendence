import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Room } from "./room.entity";

@Entity()
export class RoomBannedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Room, room => room.id)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'blocked_user_id' })
    banned_user: User;
}
