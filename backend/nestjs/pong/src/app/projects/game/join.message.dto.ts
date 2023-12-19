import { PlayerCustomization } from "src/core/projects/game/shared/entities/player.customization";

export interface  JoinMessageDTO {
	uuid: number;
	customization: PlayerCustomization;
}
