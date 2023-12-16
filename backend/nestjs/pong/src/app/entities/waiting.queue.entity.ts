import { Column, CreateDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WaitingQueue {

	@PrimaryColumn({unique: true})
	player_id: number;

	@Column({unique: true})
	game_id: number;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;
}
