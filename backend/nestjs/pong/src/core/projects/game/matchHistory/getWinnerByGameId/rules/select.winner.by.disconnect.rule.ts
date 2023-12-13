import { Winner } from "../entities/winner";

export class SelectWinnerByDisconnectRule {
	public apply(
		disconnectId: number,
		player1Id: number,
		player2Id: number,
	): Winner | null {
		let winner: Winner;
		switch (disconnectId) {
			case player1Id:
				winner = new Winner(player2Id);
				break;
			case player2Id:
				winner = new Winner(player1Id);
				break;
		}
		return winner;
	}
}
