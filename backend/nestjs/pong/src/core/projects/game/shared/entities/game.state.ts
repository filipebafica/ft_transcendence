import Ball from "./ball";
import Canvas from "./canvas";
import Player from "./player";

export default class GameState {
	constructor(
		public id: number,
		public status: number,
		public ball: Ball,
		public board: Canvas,
		public player1Score: number,
		public player2Score: number,
		public player1: Player,
		public player2?: Player,
	) {
	}
}
