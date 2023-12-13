export class GameHistoryDTO {
	constructor(
		public gameId: number,
		public status: number,
		public player1Id: number,
		public player2Id: number,
		public player1Score: number,
		public player2Score: number,
		public disconnectedId?: number,
	){}
}
