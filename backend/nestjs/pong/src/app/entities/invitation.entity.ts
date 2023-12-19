import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Invitation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	sender_id: number;

	@Column()
	sender_socket_id: string;

	@Column()
	receiver_id: number;

	@Column({nullable: true})
	receiver_socket_id: string | null;

	@Column({nullable: true})
	game_id: number | null;

	@Column()
	status: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;
}
