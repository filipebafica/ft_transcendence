import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WaitingQueue {

	@PrimaryColumn({unique: true})
	player_id: number;

	@Column({unique: true, nullable: true})
	game_id: number;

	@Column()
	game_type: string;

	@Column()
	player_status: string;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;
}
