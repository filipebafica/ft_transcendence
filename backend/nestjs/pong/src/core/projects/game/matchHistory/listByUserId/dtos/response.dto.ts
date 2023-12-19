import { GameHistoryDTO } from "../../../shared/dtos/game.history.dto";

export class Response {
	constructor(
		public matchHistories: GameHistoryDTO[],
		public numPages: number,
	){}

	public toJson() {
		return {
			"status": "success",
			"numPages": this.numPages, 
			"games": this.matchHistories,
		}
	}
}
