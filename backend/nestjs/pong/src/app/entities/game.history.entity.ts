import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class GameHistory {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	status: number;

	@Column()
	player_one_id: number;

	@Column({nullable: true})
	player_two_id: number | null;

	@Column()
	player_one_score: number;

	@Column()
	player_two_score: number;

	@Column({nullable: true})
	disconnected_id: number | null;

	@Column({nullable: true})
	winner_id: number | null;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	updated_at: Date;
}
