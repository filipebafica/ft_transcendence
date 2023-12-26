import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ClientManager {
	@PrimaryColumn({unique: true})
	client_id: string;

	@Column({unique: true})
	player_id: number;

	@Column()
	game_id: number;

	@CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at: Date;
}
