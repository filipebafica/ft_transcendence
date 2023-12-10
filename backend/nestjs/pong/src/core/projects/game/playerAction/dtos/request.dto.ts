export class Request {
	constructor(
		public playerId: string | number,
		public gameId: string | number,
		public action: string,
	) {
	}
}
