import { InviteMessageDTO } from "src/app/projects/game/invite.message.dto";

export class Request {
	constructor(
		public socketId: string,
		public message: InviteMessageDTO,
	){}
}
