import { JoinMessageDTO } from "src/app/projects/game/join.message.dto";

export class Request {
	constructor(
		public socketId: string,
		public joinMessage: JoinMessageDTO,
	) {
	}
}
