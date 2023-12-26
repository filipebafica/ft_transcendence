export class InviteDTO {
	constructor(
		public id: number,
		public sender_id: number,
		public sender_socket_id: string,
		public receiver_id: number,
		public receiver_socket_id: string,
		public game_id: number | null,
		public status: string,
	){}

}
