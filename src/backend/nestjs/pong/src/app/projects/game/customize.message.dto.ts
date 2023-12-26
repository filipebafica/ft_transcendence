import { PlayerCustomization } from "src/core/projects/game/shared/entities/player.customization";

export interface CustomizeMessageDTO {
	meta: string; //customize
	data: {
		playerId: number;
		gameId: number;
		customization: PlayerCustomization;
	}
}
