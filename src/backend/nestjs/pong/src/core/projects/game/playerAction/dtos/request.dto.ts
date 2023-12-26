export class Request {
	constructor(
		public playerId: number,
		public gameId: number,
		public action: string,
	) {
	}
}
