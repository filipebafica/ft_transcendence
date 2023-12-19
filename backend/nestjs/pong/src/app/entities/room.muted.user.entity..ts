import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Room } from "./room.entity";

@Entity()
export class RoomMutedUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
    last_mute: Date;

    @Column()
    mute_time: number;

    @ManyToOne(() => Room, room => room.id)
    @JoinColumn({ name: 'room_id' })
    room: Room;

    @ManyToOne(() => User, user => user.id)
    @JoinColumn({ name: 'muted_user_id' })
    muted_user: User;
}
