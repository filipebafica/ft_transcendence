import RoomGateway from "../../shared/gateways/room.gateway";

export class ChangePasswordRule {
	constructor(
		private roomGateway: RoomGateway,
	) {
	}

	public async apply(
		roomId: number,
		newPassword?: string
	){
		await this.roomGateway.changePassword(
			roomId,
			newPassword
		);
	}
}
