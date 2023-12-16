export class Response {
	constructor(
		public result: string,
		public winner?: number,
	) {
	}

	public toJson() {
		return {
			"result": this.result,
			"winnerId": this.winner != null ? this.winner : null,
		}
	}
}
