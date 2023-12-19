import { Server } from "socket.io";

export class MessageEmitterAdapter {
	constructor(
		private emitter: Server
	){}

	public emit(topic: string, message: any) {
		this.emitter.emit(topic, message);
	}
}
