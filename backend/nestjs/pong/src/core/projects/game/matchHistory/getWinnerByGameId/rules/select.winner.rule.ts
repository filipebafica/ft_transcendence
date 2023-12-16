import { Winner } from "../entities/winner";

export class SelectWinnerRule {
	public apply(
		player1Id: number,
		player1Score: number,
		player2Id: number,
		player2Score: number,
	): Winner {
		let winner: Winner;
		if (player1Score > player2Score) {
			winner = new Winner(player1Id);
		} else if (player2Score > player1Score) {
			winner = new Winner(player2Id);
		}

		return winner;
	}
}
