import { response } from "express";
import { Winner } from "../entities/winner";

export class Response {
	constructor(
		public result: string,
		public winner?: Winner,
	) {
	}

	public toJson() {
		return {
			"result": this.result,
			"winner": this.winner != null ? this.winner : null,
		}
	}
}
