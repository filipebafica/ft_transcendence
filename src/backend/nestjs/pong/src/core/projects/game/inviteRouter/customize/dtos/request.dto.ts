import { CustomizeMessageDTO } from "src/app/projects/game/customize.message.dto";

export class Request {
	constructor(
		public socketId: string,
		public message: CustomizeMessageDTO,
	){}
}
