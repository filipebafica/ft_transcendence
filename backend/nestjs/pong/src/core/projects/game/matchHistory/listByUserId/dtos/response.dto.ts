import { GameHistoryDTO } from "../../../shared/dtos/game.history.dto";

export class Response {
	constructor(
		public matchHistories: GameHistoryDTO[],
	){}

	public toJson() {
		return {
			"status": "success",
			"games": this.matchHistories,
		}
	}
}
