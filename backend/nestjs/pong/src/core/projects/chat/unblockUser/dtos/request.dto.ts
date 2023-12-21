export class RequestDTO {
	constructor(
		public readonly unBlockerUserId: number,
		public readonly targetUserId: number
	) {
	}
}
