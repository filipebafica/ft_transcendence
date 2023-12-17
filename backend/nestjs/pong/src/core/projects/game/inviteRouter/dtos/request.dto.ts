import { MessageDTO } from "src/app/projects/game/message.dto";

export class Request {
	constructor(
		public socketId: string,
		public message: MessageDTO,
	){}
}
