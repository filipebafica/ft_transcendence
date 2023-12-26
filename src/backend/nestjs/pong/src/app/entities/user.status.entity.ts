import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Friend } from "./friend.entity";

@Entity()
export class UserStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User, user => user.id)
    @JoinColumn({ name: 'user_status_id' })
    user: User;

    @Column()
    status: string;

    @OneToMany(() => Friend, friend => friend.user)
    friend: Friend
}